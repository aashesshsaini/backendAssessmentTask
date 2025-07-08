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
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const signup = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = body;
    try {
        const existingUserData = yield models_1.User.findOne({ email }).lean();
        if (existingUserData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.EMAIL_EXIST);
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield models_1.User.create({ name, email, password: hashedPassword });
        return user;
    }
    catch (error) {
        console.log(error, "error...........");
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ERROR, appConstant_1.ERROR_MESSAGES.SERVER_ERROR);
    }
});
exports.signup = signup;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = body;
    try {
        const user = yield models_1.User.findOne({ email });
        if (!user) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
        }
        return user;
    }
    catch (error) {
        console.log(error, "error...........");
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ERROR, appConstant_1.ERROR_MESSAGES.SERVER_ERROR);
    }
});
exports.login = login;
