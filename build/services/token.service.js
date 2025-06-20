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
exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const mongodb_1 = require("mongodb");
const config_1 = __importDefault(require("../config/config"));
const appConstant_1 = require("../config/appConstant");
const models_1 = require("../models");
const generateToken = (data, secret = config_1.default.jwt.secret) => {
    const payload = {
        exp: data.tokenExpires.unix(),
        type: data.tokenType,
        id: data.tokenId,
        role: data.userType,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
const saveToken = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const dataToBeSaved = {
        expires: data.tokenExpires.toDate(),
        type: data.tokenType,
        _id: data.tokenId,
        device: { type: data.deviceType, token: data.deviceToken, id: data.deviceId },
        role: data.userType,
        token: data === null || data === void 0 ? void 0 : data.accessToken,
        otp: data.otp
    };
    if (data.userType === appConstant_1.USER_TYPE.PLAYER) {
        data.userType === appConstant_1.USER_TYPE.PLAYER;
        dataToBeSaved.player = (_a = data.player) === null || _a === void 0 ? void 0 : _a._id;
        ;
    }
    const tokenDoc = yield models_1.Token.create(dataToBeSaved);
    console.log(tokenDoc, "tokenDoc.....");
    return tokenDoc;
});
const generateAuthToken = (userType, player, deviceToken, deviceType, deviceId, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenExpires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'days');
    const tokenId = new mongodb_1.ObjectId();
    const accessToken = generateToken({
        tokenExpires,
        tokenType: appConstant_1.TOKEN_TYPE.ACCESS,
        userType,
        tokenId,
        deviceToken,
        deviceType,
        deviceId
        // user
    });
    yield saveToken({
        accessToken,
        tokenExpires,
        tokenId,
        deviceToken,
        deviceType,
        deviceId,
        tokenType: appConstant_1.TOKEN_TYPE.ACCESS,
        userType,
        player,
        otp
    });
    return {
        token: accessToken,
        expires: tokenExpires.toDate(),
    };
});
exports.generateAuthToken = generateAuthToken;
