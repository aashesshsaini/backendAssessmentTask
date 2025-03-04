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
const config_1 = __importDefault(require("../config/config"));
const twilio_1 = require("twilio");
const sendOtp = (phoneNumber, countryCode) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        var accountSid = config_1.default.twilio.accountSID; // Your Account SID from www.twilio.com/console
        var authToken = config_1.default.twilio.accountSecret; // Your Auth Token from www.twilio.com/console
        console.log({ phoneNumber, countryCode });
        const OTP = Math.floor(100000 + Math.random() * 900000);
        // var OTP = "111112"
        // const client = require("twilio")(accountSid, authToken);
        const client = new twilio_1.Twilio(accountSid, authToken);
        client.messages
            .create({
            body: `Your Jam Nation code is: ${OTP}. Do not share it with anyone.\n@jam-nation.com`,
            from: config_1.default.twilio.phoneNumber,
            to: countryCode + phoneNumber,
        })
            .then(() => {
            let otpExpires = new Date();
            otpExpires.setSeconds(otpExpires.getSeconds() + 240);
            let otp = {
                code: String(OTP),
                expiresAt: otpExpires
            };
            console.log(otp, "otp..............");
            resolve(otp);
        })
            .catch((err) => {
            console.log(err);
            reject(err);
        });
    });
});
exports.default = sendOtp;
