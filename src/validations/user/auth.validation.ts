import Joi from "joi";
import { JOI } from "../../config/appConstant";

const login = {
  body: Joi.object().keys({
    mobileNumber: Joi.string()
      .min(5)
      .max(15)
      .pattern(/^[0-9]+$/),
    countryCode: Joi.string().required(),
    deviceId: Joi.string(),
    deviceToken: Joi.string(),
    deviceType: JOI.DEVICE_TYPE
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const resendOtp = {
  body: Joi.object().keys({}),
};

const createProfile = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    gender: Joi.string().valid("male", "women"),
    age: Joi.number(),
    email: JOI.EMAIL
  })
}

const deleteAccount = {
  query: Joi.object().keys({
    password: JOI.PASSWORD,
  }),
};

const logout = {
  body: Joi.object().keys({}),
};

const editProfile = {
  body: Joi.object().keys({
    fullName: Joi.string(),
    age: Joi.number(),
    gender: Joi.string().valid("male", "women"),
    email: Joi.string().email().lowercase().trim(),
    profileImage: Joi.string(),
  }),
};


const userInfo = {
  query: Joi.object().keys({
  }),
};

const pushNotificationStatus = {
  body: Joi.object().keys({

  })
}

export default {
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
