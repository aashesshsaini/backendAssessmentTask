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
const passport_1 = __importDefault(require("passport"));
require("../config/passport");
const appConstant_1 = require("../config/appConstant");
const error_1 = require("../utils/error");
const verifyCallback = (req, resolve, reject, expectedRole) => (err, token, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (err || info || !token) {
        console.log('errrrrrrrrrrrr');
        return reject(new error_1.AuthFailedError());
    }
    if (expectedRole && token.role !== expectedRole) {
        console.log(token, 'ROLE>>>>>>>>');
        return reject(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.UNAUTHORIZED, appConstant_1.STATUS_CODES.AUTH_FAILED));
    }
    if (token.role === appConstant_1.USER_TYPE.PLAYER && !token.player) {
        console.log(token.player);
        return reject(new error_1.AuthFailedError());
    }
    if (token.role === appConstant_1.USER_TYPE.PLAYER) {
        if (!token.player) {
            return reject(new error_1.AuthFailedError());
        }
        if (token.player.isDeleted) {
            return reject(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.ACCOUNT_DELETED, appConstant_1.STATUS_CODES.AUTH_FAILED));
        }
        if (token.player.isBlocked) {
            return reject(new error_1.AuthFailedError(appConstant_1.ERROR_MESSAGES.ACCOUNT_BLOCKED, appConstant_1.STATUS_CODES.AUTH_FAILED));
        }
    }
    req.token = token;
    return resolve();
});
const auth = (expectedRole, option) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization && option) {
        return next();
    }
    console.log(expectedRole, "expectedRole........");
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        yield passport_1.default.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, expectedRole))(req, res, next);
    }))
        .then(() => next())
        .catch((err) => next(err));
});
exports.default = auth;
