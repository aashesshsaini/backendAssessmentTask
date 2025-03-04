"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const login = {
    body: joi_1.default.object().keys({
        mobileNumber: joi_1.default.string()
            .min(5)
            .max(15)
            .pattern(/^[0-9]+$/),
        countryCode: joi_1.default.string().required(),
        deviceId: joi_1.default.string(),
        deviceToken: joi_1.default.string(),
        deviceType: appConstant_1.JOI.DEVICE_TYPE
    }),
};
const createProfile = {
    body: joi_1.default.object().keys({
        fullName: joi_1.default.string().required(),
        gender: joi_1.default.string().valid("male", "women"),
        age: joi_1.default.number(),
        email: appConstant_1.JOI.EMAIL
    })
};
const deleteAccount = {
    query: joi_1.default.object().keys({
        password: appConstant_1.JOI.PASSWORD,
    }),
};
const logout = {
    body: joi_1.default.object().keys({}),
};
const editProfile = {
    body: joi_1.default.object().keys({
        fullName: joi_1.default.string(),
        age: joi_1.default.number(),
        gender: joi_1.default.string().valid("male", "women"),
        email: joi_1.default.string().email().lowercase().trim(),
        profileImage: joi_1.default.string(),
    }),
};
const userInfo = {
    query: joi_1.default.object().keys({}),
};
const pushNotificationStatus = {
    body: joi_1.default.object().keys({})
};
exports.default = {
    login,
    createProfile,
    deleteAccount,
    logout,
    editProfile,
    userInfo,
    pushNotificationStatus
};
