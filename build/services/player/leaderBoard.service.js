"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleArchiveScoresAndReset = exports.getTopPlayers = exports.updatePlayerScore = exports.archiveScoresAndReset = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const redis_1 = __importDefault(require("../../utils/redis"));
const models_1 = require("../../models");
const universalFunctions_1 = require("../../utils/universalFunctions");
const getLeaderboardKey = (region, mode) => `leaderboard:${region}:${mode}`;
const getTopCacheKey = (region, mode, limit, page) => `top:${region}:${mode}:${limit}:${page}`;
const updatePlayerScore = (playerId, score, region, mode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = getLeaderboardKey(region, mode);
        const existing = yield models_1.PlayerScore.findOne({ playerId, region, mode });
        if (existing) {
            existing.score += score;
            yield existing.save();
        }
        else {
            yield models_1.PlayerScore.create({ playerId, region, mode, score });
        }
        yield redis_1.default.zIncrBy(key, score, playerId.toString());
        yield redis_1.default.expire(key, 86400); // 24h TTL
        // 3. Invalidate leaderboard cache
        const pattern = `top:${region}:${mode}:*`;
        const keys = yield redis_1.default.keys(pattern);
        for (const k of keys)
            yield redis_1.default.del(k);
    }
    catch (err) {
        console.log(err, "error.........................");
    }
});
exports.updatePlayerScore = updatePlayerScore;
const getTopPlayers = (region_1, mode_1, ...args_1) => __awaiter(void 0, [region_1, mode_1, ...args_1], void 0, function* (region, mode, page = 1, limit = 10) {
    try {
        const cacheKey = getTopCacheKey(region, mode, limit, page);
        const cached = yield redis_1.default.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const zsetKey = getLeaderboardKey(region, mode);
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        const zData = yield redis_1.default.zRangeWithScores(zsetKey, start, end, { REV: true });
        if (zData.length > 0) {
            const result = zData.map((entry, index) => ({
                rank: start + index + 1,
                playerId: entry.value,
                score: entry.score,
            }));
            yield redis_1.default.set(cacheKey, JSON.stringify(result), { EX: 30 });
            return result;
        }
        const mongoData = yield models_1.PlayerScore.find({ region, mode }, (0, universalFunctions_1.paginationOptions)(page, limit));
        const result = mongoData.map((entry, index) => ({
            rank: start + index + 1,
            playerId: entry.player,
            score: entry.score,
        }));
        // Rebuild Redis ZSET for future
        for (const entry of mongoData) {
            yield redis_1.default.zAdd(zsetKey, {
                score: entry.score,
                value: entry.player.toString(),
            });
        }
        yield redis_1.default.expire(zsetKey, 86400);
        yield redis_1.default.set(cacheKey, JSON.stringify(result), { EX: 30 });
        return result;
    }
    catch (err) {
        console.log(err, "error..............");
    }
});
exports.getTopPlayers = getTopPlayers;
const archiveScoresAndReset = () => __awaiter(void 0, void 0, void 0, function* () {
    const scores = yield models_1.PlayerScore.find({});
    for (const s of scores) {
        yield models_1.ArchivedScore.create({
            player: s.player,
            region: s.region,
            mode: s.mode,
            score: s.score,
            date: new Date(),
        });
    }
    yield models_1.PlayerScore.deleteMany({});
    yield redis_1.default.flushDb();
});
exports.archiveScoresAndReset = archiveScoresAndReset;
const scheduleArchiveScoresAndReset = () => __awaiter(void 0, void 0, void 0, function* () {
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Running daily leaderboard archive...");
        yield (0, exports.archiveScoresAndReset)();
        console.log("Archived and reset leaderboard.");
    }));
});
exports.scheduleArchiveScoresAndReset = scheduleArchiveScoresAndReset;
