import { Request, Response, NextFunction } from "express";
import { userAuthService, tokenService } from "../../services";
import { successResponse } from "../../utils/response";
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";
import { formatSignUpUser, formatUser } from "../../utils/formatResponse";
import { TokenDocument, UserDocument } from "../../interfaces";
import { ObjectId } from "mongoose";
// import sendOtp from "../../libs/sendOtp";
import { optional } from "joi";
import { Dictionary } from "../../types";
import sendOtp from "../../libs/sendOtp";


const login = catchAsync(async (req: Request, res: Response) => {
  const userData = await userAuthService.login(req.body) as UserDocument;
  const deviceToken = req.body.deviceToken as string;
  const deviceType = req.body.deviceType as string;
  const deviceId = req.body.deviceType as string;
  const otp = { code: "111111", expiresAt: "2024-09-11T13:24:23.676Z" };

  // const otp = await sendOtp(req.body.mobileNumber as string, req.body.countryCode as string) as { code: string, expiresAt: string }
  const accessToken = await tokenService.generateAuthToken(
    USER_TYPE.USER,
    userData,
    deviceToken,
    deviceType,
    deviceId,
    otp
  );

  const formatUserData = formatSignUpUser(userData);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    {
      tokenData: accessToken,
      userData: formatUserData,
    }
  );
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  await userAuthService.verifyOtp(req.body.code, req.token._id);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  await userAuthService.resendOtp(req.token?.user);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});

const createProfile = catchAsync(async (req: Request, res: Response) => {
  console.log(req.token)
  const userData = await userAuthService.createProfile(req.body, req.token.user._id) as UserDocument;

  const formatUserData = formatSignUpUser(userData);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    formatUserData
  );
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  await userAuthService.deleteAccount(req?.token?.user, req.query);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DELETE
  );
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await userAuthService.logout(req?.token?.user);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT
  );
});

const editProfile = catchAsync(async (req: Request, res: Response) => {
  const updatedProfileData = await userAuthService.editProfile(
    req?.token?.user?._id,
    req?.body
  ) as UserDocument;
  const formatedUpdatedProfileData = formatUser(updatedProfileData);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    formatedUpdatedProfileData
  );
});


const userInfo = catchAsync(async (req: Request, res: Response) => {
  const userInfo = await userAuthService.userInfo(req?.token?.user, req.query);
  const formatedUserInfo = formatUser(userInfo)

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    formatedUserInfo
  );
});

const pushNotificationStatus = catchAsync(async (req: Request, res: Response) => {
  const userInfo = await userAuthService.pushNotificationStatus(req?.token?.user);
  const formatedUserInfo = formatUser(userInfo)
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    formatedUserInfo
  );
});

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
