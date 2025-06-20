import { Request, Response, NextFunction } from "express";
import { playerAuthService, tokenService } from "../../services";
import { successResponse } from "../../utils/response";
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";
import { formatSignUpUser, formatUser } from "../../utils/formatResponse";
import { TokenDocument, PlayerDocument } from "../../interfaces";


const signup = catchAsync(async (req: Request, res: Response) => {
  const userData = await playerAuthService.signup(req.body) as PlayerDocument;
  const deviceToken = req.body.deviceToken as string;
  const deviceType = req.body.deviceType as string;
  const deviceId = req.body.deviceType as string;

  const accessToken = await tokenService.generateAuthToken(
    USER_TYPE.PLAYER,
    userData,
    deviceToken,
    deviceType,
    deviceId,
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


const login = catchAsync(async (req: Request, res: Response) => {
  const userData = await playerAuthService.login(req.body) as PlayerDocument;
  const deviceToken = req.body.deviceToken as string;
  const deviceType = req.body.deviceType as string;
  const deviceId = req.body.deviceType as string;
  const otp = { code: "111111", expiresAt: "2024-09-11T13:24:23.676Z" };

  // const otp = await sendOtp(req.body.mobileNumber as string, req.body.countryCode as string) as { code: string, expiresAt: string }
  const accessToken = await tokenService.generateAuthToken(
    USER_TYPE.PLAYER,
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

export default {
  signup,
  login,
};
