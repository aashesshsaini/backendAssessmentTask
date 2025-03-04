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
exports.pushNotificationStatus = exports.userInfo = exports.editProfile = exports.logout = exports.deleteAccount = exports.createProfile = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config/config"));
const stripeInstance = new stripe_1.default(config_1.default.stripeSecretKey);
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber } = body;
    console.log(body, "body............");
    try {
        const user = yield models_1.User.findOneAndUpdate({ mobileNumber }, { isDeleted: false }, { upsert: true, new: true });
        console.log(user);
        if (user.isBlocked) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.ACCOUNT_BLOCKED);
        }
        // const stripeCustomer = await stripeInstance.customers.create({
        //       name: firstName,
        //       email,
        //       phone: `${countryCode}${mobileNumber}`,
        //     });
        //     user.stripeCustomerId = stripeCustomer.id;
        //     await user.save();
        //     return user;
        return user;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.login = login;
const createProfile = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, age, gender } = body;
    try {
        const updatedUserData = yield models_1.User.findByIdAndUpdate(userId, { fullName, email, age, gender, isCreatedProfileUser: true }, { new: true });
        // const stripeCustomer = await stripeInstance.customers.create({
        //   name: fullName,
        //   email,
        //   phone: `${updatedUserData?.countryCode}${updatedUserData?.mobileNumber}`,
        // });
        // updatedUserData.stripeCustomerId = stripeCustomer.id;
        // await updatedUserData?.save();
        return updatedUserData;
    }
    catch (error) {
        console.log(error);
        throw new error;
    }
});
exports.createProfile = createProfile;
const deleteAccount = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = query;
    try {
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        console.log(passwordMatch);
        if (!passwordMatch) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.WRONG_PASSWORD);
        }
        const [deletedUser, deletedToken] = yield Promise.all([
            models_1.User.findByIdAndUpdate(user._id, { isDeleted: true, isVerified: false }, { lean: true, new: true }),
            models_1.Token.updateMany({ user: user._id }, { isDeleted: false }, { lean: true, new: true }),
        ]);
        if (!deletedUser) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.deleteAccount = deleteAccount;
const logout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Token.updateMany({ user: userId }, { isDeleted: false });
});
exports.logout = logout;
const editProfile = (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, age, gender } = body;
    try {
        const updatedProfileData = yield models_1.User.findByIdAndUpdate(userId, {
            fullName,
            email,
            age,
            gender
        }, { lean: true, new: true });
        if (!updatedProfileData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.NOT_FOUND, appConstant_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        return updatedProfileData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.editProfile = editProfile;
const userInfo = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    return user;
});
exports.userInfo = userInfo;
const pushNotificationStatus = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (user.isPushNotification) {
            user.isPushNotification = false;
        }
        else if (!user.isPushNotification) {
            user.isPushNotification = true;
        }
        return user;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.pushNotificationStatus = pushNotificationStatus;
