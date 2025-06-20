"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const signup = {
    body: joi_1.default.object().keys({
        fullName: joi_1.default.string().required(),
        email: appConstant_1.JOI.EMAIL,
        password: appConstant_1.JOI.PASSWORD,
        mobileNumber: appConstant_1.JOI.PHONENUMBER,
        countryCode: joi_1.default.string(),
        age: joi_1.default.number().required(),
        gender: joi_1.default.string().required().valid("Male", "Female", "Transgender"),
        region: joi_1.default.string().required(),
        deviceId: joi_1.default.string(),
        deviceToken: joi_1.default.string(),
        deviceType: appConstant_1.JOI.DEVICE_TYPE
    })
};
const login = {
    body: joi_1.default.object().keys({
        email: appConstant_1.JOI.EMAIL,
        password: appConstant_1.JOI.PASSWORD,
        deviceId: joi_1.default.string(),
        deviceToken: joi_1.default.string(),
        deviceType: appConstant_1.JOI.DEVICE_TYPE
    }),
};
exports.default = {
    signup,
    login,
};
