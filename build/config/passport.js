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
const passport_jwt_1 = require("passport-jwt");
const config_1 = __importDefault(require("./config"));
const appConstant_1 = require("./appConstant");
const models_1 = require("../models");
const error_1 = require("../utils/error");
const jwtOptions = {
    secretOrKey: config_1.default.jwt.secret,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(payload);
        if (payload.type !== "access") {
            throw new error_1.AuthFailedError();
        }
        var token = null;
        if (payload.role === appConstant_1.USER_TYPE.USER) {
            token = yield models_1.Token.findOne({ _id: payload.id, isDeleted: false })
                .populate({ path: "user" })
                .lean();
        }
        if (!token) {
            return done(null, false);
        }
        done(null, token);
    }
    catch (error) {
        console.log("errorrrrr", error);
        done(error, false);
    }
});
exports.default = (passport) => {
    try {
        passport.use(new passport_jwt_1.Strategy(jwtOptions, jwtVerify));
    }
    catch (error) {
        return error;
    }
};
