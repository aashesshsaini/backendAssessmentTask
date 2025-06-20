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
exports.connectSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const token_model_1 = __importDefault(require("../models/token.model"));
const appConstant_1 = require("../config/appConstant");
const error_1 = require("../utils/error");
const leaderBoard_service_1 = require("../services/player/leaderBoard.service");
const connectSocket = (server) => {
    const connectedPlayers = new Map(); // { playerId: socketId }
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a.token;
            if (!token) {
                return next(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, appConstant_1.STATUS_CODES.AUTH_FAILED));
            }
            jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return next(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, appConstant_1.STATUS_CODES.AUTH_FAILED));
                }
                const tokenDoc = yield token_model_1.default.findOne({ token }).lean();
                if (!tokenDoc || decoded.role !== appConstant_1.USER_TYPE.PLAYER) {
                    return next(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.AUTHENTICATION_FAILED, appConstant_1.STATUS_CODES.AUTH_FAILED));
                }
                const playerId = tokenDoc.player.toString();
                socket.data = { decoded, playerId };
                connectedPlayers.set(playerId, socket.id);
                console.log(`[Socket] Player connected: ${playerId} - ${socket.id}`);
                next();
            }));
        }
        catch (err) {
            next(err);
        }
    }));
    io.on("connection", (socket) => {
        console.log("[Socket] Player connection established:", socket.id);
        socket.on("updateScore", (data) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { score, region, mode } = data;
            const playerId = (_a = socket.data) === null || _a === void 0 ? void 0 : _a.playerId;
            if (!playerId || !region || !mode || typeof score !== "number") {
                return socket.emit("error", { message: "Invalid updateScore payload" });
            }
            yield (0, leaderBoard_service_1.updatePlayerScore)(playerId, score, region, mode);
            const topPlayers = yield (0, leaderBoard_service_1.getTopPlayers)(region, mode, 10);
            io.emit("leaderboardUpdate", topPlayers);
        }));
        socket.on("getTopPlayers", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { region, mode, limit = 10 } = data;
            if (!region || !mode) {
                return socket.emit("error", { message: "Missing region/mode" });
            }
            const topPlayers = yield (0, leaderBoard_service_1.getTopPlayers)(region, mode, limit);
            socket.emit("leaderboardData", topPlayers);
        }));
        socket.on("disconnect", () => {
            var _a;
            const playerId = (_a = socket.data) === null || _a === void 0 ? void 0 : _a.playerId;
            if (playerId && connectedPlayers.has(playerId)) {
                connectedPlayers.delete(playerId);
                console.log(`[Socket] Player disconnected: ${playerId}`);
            }
        });
    });
};
exports.connectSocket = connectSocket;
