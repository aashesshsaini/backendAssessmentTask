import Joi from "joi";
import { JOI } from "../../config/appConstant";

const signup = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    email: JOI.EMAIL,
    password: JOI.PASSWORD,
    mobileNumber: JOI.PHONENUMBER,
    countryCode: Joi.string(),
    age: Joi.number().required(),
    gender: Joi.string().required().valid("Male", "Female", "Transgender"),
    region: Joi.string().required(),
    deviceId: Joi.string(),
    deviceToken: Joi.string(),
    deviceType: JOI.DEVICE_TYPE
  })
}

const login = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    password: JOI.PASSWORD,
    deviceId: Joi.string(),
    deviceToken: Joi.string(),
    deviceType: JOI.DEVICE_TYPE
  }),
};

export default {
  signup,
  login,
};
