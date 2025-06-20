"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_CODES = exports.ERROR_MESSAGES = exports.SUCCESS_MESSAGES = exports.JOI = exports.DEVICE_TYPE = exports.USER_TYPE = exports.TOKEN_TYPE = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validations/custom.validation");
const TOKEN_TYPE = {
    ACCESS: "access",
    REFRESH: "refresh",
    RESET_PASSWORD: "resetPassword",
};
exports.TOKEN_TYPE = TOKEN_TYPE;
const USER_TYPE = {
    PLAYER: "player",
};
exports.USER_TYPE = USER_TYPE;
const DEVICE_TYPE = {
    IPHONE: "iPhone",
    ANDROID: "android",
    WEB: "web",
};
exports.DEVICE_TYPE = DEVICE_TYPE;
const JOI = {
    EMAIL: joi_1.default.string().email().lowercase().trim().required(),
    PASSWORD: joi_1.default.string().min(8).required(),
    PHONENUMBER: joi_1.default.string()
        .min(5)
        .max(15)
        .pattern(/^[0-9]+$/),
    OBJECTID: joi_1.default.string().custom(custom_validation_1.objectId).required(),
    LIMIT: joi_1.default.number().default(10000),
    PAGE: joi_1.default.number().default(0),
    DEVICE_TYPE: joi_1.default.string()
        .valid(...Object.values(DEVICE_TYPE))
        .required(),
    USER_TYPE: joi_1.default.string().valid(USER_TYPE.PLAYER).required(),
};
exports.JOI = JOI;
const SUCCESS_MESSAGES = {
    SUCCESS: "Success",
    LOGOUT: "User successfully logged out",
    DELETE: "user Delete successfully",
};
exports.SUCCESS_MESSAGES = SUCCESS_MESSAGES;
const ERROR_MESSAGES = {
    NOT_FOUND: "Not found",
    VALIDATION_FAILED: "Validation Failed, Kindly check your parameters",
    SERVER_ERROR: "Something went wrong, Please try again.",
    AUTHENTICATION_FAILED: "Please authenticate",
    UNAUTHORIZED: "You are not authorized to perform this action",
    EMAIL_NOT_FOUND: "Email not found",
    ACCOUNT_NOT_EXIST: "Account does not exist",
    WRONG_PASSWORD: "Password is Incorrect",
    ACCOUNT_DELETED: "Your account has been deleted",
    ACCOUNT_BLOCKED: "Your account has been blocked by Admin",
    PLAYER_NOT_FOUND: "Player not found",
    FIELD_REQUIRED: "All the fields are required",
};
exports.ERROR_MESSAGES = ERROR_MESSAGES;
const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    ACTION_PENDING: 202,
    ACTION_COMPLETE: 204,
    VALIDATION_FAILED: 400,
    ACTION_FAILED: 400,
    AUTH_FAILED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
    ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};
exports.STATUS_CODES = STATUS_CODES;
