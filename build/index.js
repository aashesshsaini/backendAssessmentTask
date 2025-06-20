"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
const app_1 = __importDefault(require("./app"));
const socket_1 = require("./utils/socket");
const leaderBoard_service_1 = require("./services/player/leaderBoard.service");
const mongooseOptions = {};
mongoose_1.default.connect(config_1.default.mongoose.url, mongooseOptions).then(() => {
    console.log("Connected to MongoDB");
    const server = app_1.default.listen(config_1.default.port, () => {
        (0, socket_1.connectSocket)(server);
        (0, leaderBoard_service_1.scheduleArchiveScoresAndReset)();
        console.log(`Listening to port ${config_1.default.port}`);
    });
});
