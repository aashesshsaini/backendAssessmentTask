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
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const response_1 = require("../../utils/response");
const appConstant_1 = require("../../config/appConstant");
const universalFunctions_1 = require("../../utils/universalFunctions");
const formatResponse_1 = require("../../utils/formatResponse");
const signup = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield services_1.playerAuthService.signup(req.body);
    const deviceToken = req.body.deviceToken;
    const deviceType = req.body.deviceType;
    const deviceId = req.body.deviceType;
    const accessToken = yield services_1.tokenService.generateAuthToken(appConstant_1.USER_TYPE.PLAYER, userData, deviceToken, deviceType, deviceId);
    const formatUserData = (0, formatResponse_1.formatSignUpUser)(userData);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, {
        tokenData: accessToken,
        userData: formatUserData,
    });
}));
const login = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield services_1.playerAuthService.login(req.body);
    const deviceToken = req.body.deviceToken;
    const deviceType = req.body.deviceType;
    const deviceId = req.body.deviceType;
    const otp = { code: "111111", expiresAt: "2024-09-11T13:24:23.676Z" };
    // const otp = await sendOtp(req.body.mobileNumber as string, req.body.countryCode as string) as { code: string, expiresAt: string }
    const accessToken = yield services_1.tokenService.generateAuthToken(appConstant_1.USER_TYPE.PLAYER, userData, deviceToken, deviceType, deviceId, otp);
    const formatUserData = (0, formatResponse_1.formatSignUpUser)(userData);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, {
        tokenData: accessToken,
        userData: formatUserData,
    });
}));
exports.default = {
    signup,
    login,
};
