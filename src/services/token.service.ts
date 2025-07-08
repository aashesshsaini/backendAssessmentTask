import jwt from "jsonwebtoken";
import moment from "moment";
import { Schema } from "mongoose";
import { ObjectId } from "mongodb";
import config from "../config/config";
import { TOKEN_TYPE, USER_TYPE } from "../config/appConstant";
import { Token } from "../models";
import { UserDocument, TokenDocument } from "../interfaces";

interface Data {
  user?: UserDocument;
  tokenExpires: moment.Moment;
  tokenType: string;
  tokenId: ObjectId;
  deviceToken: string;
  deviceType: string;
  deviceId: string;
  userType: string;
  accessToken?: string;
  otp?: { code: string; expiresAt: string };
}

const generateToken = (
  data: Data,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    exp: data.tokenExpires.unix(),
    type: data.tokenType,
    id: data.tokenId,
    role: data.userType,
  };

  return jwt.sign(payload, secret) as string;
};

const saveToken = async (data: Data) => {
  const dataToBeSaved: Partial<TokenDocument> = {
    expires: data.tokenExpires.toDate(),
    type: data.tokenType,
    _id: data.tokenId,
    device: {
      type: data.deviceType,
      token: data.deviceToken,
      id: data.deviceId,
    },
    role: data.userType,
    token: data?.accessToken,
    otp: data.otp,
  };

  if (data.userType === USER_TYPE.USER) {
    data.userType === USER_TYPE.USER;
    dataToBeSaved.user = (data.user as UserDocument)
      ?._id as Schema.Types.ObjectId;
  }

  const tokenDoc = await Token.create(dataToBeSaved);
  console.log(tokenDoc, "tokenDoc.....");
  return tokenDoc;
};

const generateAuthToken = async (
  userType: string,
  user: UserDocument,
  deviceToken: string,
  deviceType: string,
  deviceId: string,
  otp?: { code: string; expiresAt: string }
): Promise<{ token: string; expires: Date }> => {
  const tokenExpires = moment().add(config.jwt.accessExpirationMinutes, "days");
  const tokenId = new ObjectId();
  const accessToken: string = generateToken({
    tokenExpires,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    tokenId,
    deviceToken,
    deviceType,
    deviceId,
    // user
  });
  await saveToken({
    accessToken,
    tokenExpires,
    tokenId,
    deviceToken,
    deviceType,
    deviceId,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    user,
    otp,
  });
  return {
    token: accessToken,
    expires: tokenExpires.toDate(),
  };
};

export { generateAuthToken };
