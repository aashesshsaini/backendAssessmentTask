import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../config/config"; 
import Token from "../models/token.model"; 
import { ERROR_MESSAGES, STATUS_CODES, USER_TYPE } from "../config/appConstant";
import { AuthFailedError, OperationalError } from "../utils/error";
import {getTopPlayers, updatePlayerScore} from "../services/player/leaderBoard.service";

export const connectSocket = (server: any) => {
  const connectedPlayers = new Map<string, string>(); // { playerId: socketId }

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.query?.token as string | undefined;

      if (!token) {
        return next(
          new AuthFailedError(
            ERROR_MESSAGES.AUTHENTICATION_FAILED,
            STATUS_CODES.AUTH_FAILED
          )
        );
      }

      jwt.verify(token, config.jwt.secret, async (err: any, decoded: any) => {
        if (err) {
          return next(
            new AuthFailedError(
              ERROR_MESSAGES.AUTHENTICATION_FAILED,
              STATUS_CODES.AUTH_FAILED
            )
          );
        }

        const tokenDoc = await Token.findOne({ token }).lean();
        if (!tokenDoc || decoded.role !== USER_TYPE.PLAYER) {
          return next(
            new AuthFailedError(
              ERROR_MESSAGES.AUTHENTICATION_FAILED,
              STATUS_CODES.AUTH_FAILED
            )
          );
        }

        const playerId = tokenDoc.player.toString();
        socket.data = { decoded, playerId };
        connectedPlayers.set(playerId, socket.id);
        console.log(`[Socket] Player connected: ${playerId} - ${socket.id}`);

        next();
      });
    } catch (err) {
      next(err as Error);
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("[Socket] Player connection established:", socket.id);

    socket.on("updateScore", async (data) => {
      const { score, region, mode } = data;
      const playerId = socket.data?.playerId;

      if (!playerId || !region || !mode || typeof score !== "number") {
        return socket.emit("error", { message: "Invalid updateScore payload" });
      }

      await updatePlayerScore(playerId, score, region, mode);
      const topPlayers = await getTopPlayers(region, mode, 10);
      io.emit("leaderboardUpdate", topPlayers);
    });

    socket.on("getTopPlayers", async (data) => {
      const { region, mode, limit = 10 } = data;

      if (!region || !mode) {
        return socket.emit("error", { message: "Missing region/mode" });
      }

      const topPlayers = await getTopPlayers(region, mode, limit);
      socket.emit("leaderboardData", topPlayers);
    });

    socket.on("disconnect", () => {
      const playerId = socket.data?.playerId;
      if (playerId && connectedPlayers.has(playerId)) {
        connectedPlayers.delete(playerId);
        console.log(`[Socket] Player disconnected: ${playerId}`);
      }
    });
  });
};
