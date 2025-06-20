import { ObjectId } from "mongoose";
import redis from "../../utils/redis"
import { PlayerScore } from "../../models";
import { paginationOptions } from "../../utils/universalFunctions";

const getLeaderboardKey = (region:string, mode:string) =>
    `leaderboard:${region}:${mode}`;

const getTopCacheKey = (region: string, mode: string, limit: number, page: number) =>
  `top:${region}:${mode}:${limit}:${page}`;

const updatePlayerScore = async (playerId: ObjectId, score: number, region: string, mode: string) => {
    try {
        const key = getLeaderboardKey(region, mode);

        const existing = await PlayerScore.findOne({ playerId, region, mode });
        if (existing) {
            existing.score += score;
            await existing.save();
        } else {
            await PlayerScore.create({ playerId, region, mode, score });
        }

        await redis.zIncrBy(key, score, playerId.toString());
        await redis.expire(key, 86400); // 24h TTL

        // 3. Invalidate leaderboard cache
        const pattern = `top:${region}:${mode}:*`;
        const keys = await redis.keys(pattern);
        for (const k of keys) await redis.del(k);
    } catch (err: any) {
        console.log(err, "error.........................")
    }
};



const getTopPlayers = async (
  region: string,
  mode: string,
  page = 1,
  limit = 10
) => {
    try {
        const cacheKey = getTopCacheKey(region, mode, limit, page);
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const zsetKey = getLeaderboardKey(region, mode);
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        const zData = await redis.zRangeWithScores(zsetKey, start, end, { REV: true });
        if (zData.length > 0) {
            const result = zData.map((entry, index) => ({
                rank: start + index + 1,
                playerId: entry.value,
                score: entry.score,
            }));
            await redis.set(cacheKey, JSON.stringify(result), { EX: 30 });
            return result;
        }

        const mongoData = await PlayerScore.find({ region, mode }, paginationOptions(page, limit))

        const result = mongoData.map((entry, index) => ({
            rank: start + index + 1,
            playerId: entry.player,
            score: entry.score,
        }));

        // Rebuild Redis ZSET for future
        for (const entry of mongoData) {
            await redis.zAdd(zsetKey, {
                score: entry.score,
                value: entry.player.toString(),
            });
        }
        await redis.expire(zsetKey, 86400);
        await redis.set(cacheKey, JSON.stringify(result), { EX: 30 });

        return result;
    } catch (err: any) {
        console.log(err, "error..............")
    }
};


export = {
  updatePlayerScore,
  getTopPlayers,
};
