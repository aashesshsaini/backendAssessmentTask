"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchivedScore = exports.PlayerScore = exports.Player = exports.Token = void 0;
const token_model_1 = __importDefault(require("./token.model"));
exports.Token = token_model_1.default;
const player_model_1 = __importDefault(require("./player.model"));
exports.Player = player_model_1.default;
const playerScore_model_1 = __importDefault(require("./playerScore.model"));
exports.PlayerScore = playerScore_model_1.default;
const archivedScore_model_1 = __importDefault(require("./archivedScore.model"));
exports.ArchivedScore = archivedScore_model_1.default;
