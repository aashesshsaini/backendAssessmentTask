import jwt from 'jsonwebtoken';
import moment from 'moment';
import { Document, Schema, Types } from "mongoose";
import { ObjectId } from 'mongodb';
import { OperationalError } from '../utils/error';
import config from '../config/config';
import { TOKEN_TYPE, USER_TYPE, STATUS_CODES, ERROR_MESSAGES } from '../config/appConstant';
import { Token } from '../models';
import { JwtPayload } from '../types';
import { TokenDocument } from '../interfaces/token.interface';
import { PlayerDocument } from '../interfaces/player.interface';

interface Data {
  player?: PlayerDocument 
  tokenExpires: moment.Moment;
  tokenType: string;
  tokenId: ObjectId;
  deviceToken: string;
  deviceType: string;
  deviceId: string;
  userType: string;
  accessToken?: string,
  otp?: { code: string, expiresAt: string }
}


const generateToken = (data: Data, secret: string = config.jwt.secret): string => {
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
    device: { type: data.deviceType, token: data.deviceToken, id: data.deviceId },
    role: data.userType,
    token: data?.accessToken,
    otp: data.otp
  };

  if (data.userType === USER_TYPE.PLAYER) {
    data.userType === USER_TYPE.PLAYER;
    dataToBeSaved.player = (data.player as PlayerDocument)?._id as Schema.Types.ObjectId;;
  } 

  const tokenDoc = await Token.create(dataToBeSaved);
  console.log(tokenDoc, "tokenDoc.....")
  return tokenDoc;
};

const generateAuthToken = async (
  userType: string,
  player: PlayerDocument,
  deviceToken: string,
  deviceType: string,
  deviceId: string,
  otp?: { code: string, expiresAt: string }
): Promise<{ token: string; expires: Date }> => {
  const tokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'days');
  const tokenId = new ObjectId();
  const accessToken: string = generateToken({
    tokenExpires,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    tokenId,
    deviceToken,
    deviceType,
    deviceId
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
    player,
    otp
  });
  return {
    token: accessToken,
    expires: tokenExpires.toDate(),
  };
};

export { generateAuthToken };
