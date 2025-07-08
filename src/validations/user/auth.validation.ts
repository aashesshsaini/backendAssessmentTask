import Joi from "joi";
import { JOI } from "../../config/appConstant";

const signup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: JOI.EMAIL,
    password: JOI.PASSWORD,
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
