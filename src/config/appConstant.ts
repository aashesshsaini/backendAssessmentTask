import Joi from "joi";
import { objectId } from "../validations/custom.validation";

const TOKEN_TYPE = {
  ACCESS: "access",
  REFRESH: "refresh",
  RESET_PASSWORD: "resetPassword",
};

const USER_TYPE = {
  USER: "user",
};

const DEVICE_TYPE = {
  IPHONE: "iPhone",
  ANDROID: "android",
  WEB: "web",
};

const JOI = {
  EMAIL: Joi.string().email().lowercase().trim().required(),
  PASSWORD: Joi.string().min(8).required(),
  PHONENUMBER: Joi.string()
    .min(5)
    .max(15)
    .pattern(/^[0-9]+$/),
  OBJECTID: Joi.string().custom(objectId).required(),
  LIMIT: Joi.number().default(10000),
  PAGE: Joi.number().default(0),
  DEVICE_TYPE: Joi.string()
    .valid(...Object.values(DEVICE_TYPE))
    .required(),
  USER_TYPE: Joi.string().valid(USER_TYPE.USER).required(),
};

const SUCCESS_MESSAGES = {
  SUCCESS: "Success",
  LOGOUT: "User successfully logged out",
  DELETE: "user Delete successfully",
};

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
  USER_NOT_FOUND: "User not found",
  EXPENSES_NOT_FOUND: "Expenses not found",
  CATEGORY_NOT_FOUND: "Category not found",
  EMAIL_EXIST: "User already exist, please login",
  FIELD_REQUIRED: "All the fields are required",
};

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

export {
  TOKEN_TYPE,
  USER_TYPE,
  DEVICE_TYPE,
  JOI,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  STATUS_CODES,
};
