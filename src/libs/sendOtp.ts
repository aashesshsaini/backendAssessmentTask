import config from "../config/config";
import moment from 'moment';
import { ErrorRequestHandler } from "express";
import { Twilio } from "twilio";

const sendOtp = async (phoneNumber: string, countryCode: string) => {
    return new Promise((resolve, reject) => {
        var accountSid = config.twilio.accountSID; // Your Account SID from www.twilio.com/console
        var authToken = config.twilio.accountSecret; // Your Auth Token from www.twilio.com/console
        console.log({ phoneNumber, countryCode })
        const OTP = Math.floor(100000 + Math.random() * 900000);
        // var OTP = "111112"
        // const client = require("twilio")(accountSid, authToken);
        const client = new Twilio(accountSid, authToken);
        client.messages
            .create({
                body: `Your Jam Nation code is: ${OTP}. Do not share it with anyone.\n@jam-nation.com`,

                from: config.twilio.phoneNumber,
                to: countryCode + phoneNumber,
            })
            .then(() => {
                let otpExpires = new Date();
                otpExpires.setSeconds(otpExpires.getSeconds() + 240);
                let otp: { code: string, expiresAt: Date } = {
                    code: String(OTP),
                    expiresAt: otpExpires
                };

                console.log(otp, "otp..............")
                resolve(otp);
            })
            .catch((err: ErrorRequestHandler) => {
                console.log(err);
                reject(err);
            });
    });
};

export default sendOtp