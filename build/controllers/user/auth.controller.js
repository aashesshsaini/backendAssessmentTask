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
const login = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield services_1.userAuthService.login(req.body);
    const deviceToken = req.body.deviceToken;
    const deviceType = req.body.deviceType;
    const deviceId = req.body.deviceType;
    const otp = { code: "111111", expiresAt: "2024-09-11T13:24:23.676Z" };
    // const otp = await sendOtp(req.body.mobileNumber as string, req.body.countryCode as string) as { code: string, expiresAt: string }
    const accessToken = yield services_1.tokenService.generateAuthToken(appConstant_1.USER_TYPE.USER, userData, deviceToken, deviceType, deviceId, otp);
    const formatUserData = (0, formatResponse_1.formatSignUpUser)(userData);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, {
        tokenData: accessToken,
        userData: formatUserData,
    });
}));
const verifyOtp = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.userAuthService.verifyOtp(req.body.code, req.token._id);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS);
}));
const resendOtp = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield services_1.userAuthService.resendOtp((_a = req.token) === null || _a === void 0 ? void 0 : _a.user);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS);
}));
const createProfile = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.token);
    const userData = yield services_1.userAuthService.createProfile(req.body, req.token.user._id);
    const formatUserData = (0, formatResponse_1.formatSignUpUser)(userData);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, formatUserData);
}));
const deleteAccount = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield services_1.userAuthService.deleteAccount((_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user, req.query);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.DELETE);
}));
const logout = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield services_1.userAuthService.logout((_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.LOGOUT);
}));
const editProfile = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const updatedProfileData = yield services_1.userAuthService.editProfile((_b = (_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b._id, req === null || req === void 0 ? void 0 : req.body);
    const formatedUpdatedProfileData = (0, formatResponse_1.formatUser)(updatedProfileData);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, formatedUpdatedProfileData);
}));
const userInfo = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userInfo = yield services_1.userAuthService.userInfo((_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user, req.query);
    const formatedUserInfo = (0, formatResponse_1.formatUser)(userInfo);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, formatedUserInfo);
}));
const pushNotificationStatus = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userInfo = yield services_1.userAuthService.pushNotificationStatus((_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.user);
    const formatedUserInfo = (0, formatResponse_1.formatUser)(userInfo);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, formatedUserInfo);
}));
exports.default = {
    login,
    verifyOtp,
    resendOtp,
    createProfile,
    deleteAccount,
    logout,
    editProfile,
    userInfo,
    pushNotificationStatus
};
