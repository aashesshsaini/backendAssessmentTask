import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import config from "./config";
import { TOKEN_TYPE, USER_TYPE } from "./appConstant";
import { Token } from "../models";
import { AuthFailedError } from "../utils/error";
import { JwtPayload } from '../types';
import { TokenDocument } from '../interfaces/token.interface';


const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: JwtPayload, done: VerifiedCallback) => {
  try {
    console.log(payload)
    if (payload.type !== 'access') {
      throw new AuthFailedError();
    }

    var token: TokenDocument | null = null;;

    if(payload.role === USER_TYPE.PLAYER)
    {
      token = await Token.findOne({ _id: payload.id, isDeleted: false })
        .populate({ path: 'player' })
        .lean();
    }

    if (!token) {
      return done(null, false);
    }

    done(null, token);
  } catch (error) {
    console.log('errorrrrr', error);
    done(error, false);
  }
};

export default (passport: any) => {
  try {
    passport.use(new JwtStrategy(jwtOptions, jwtVerify));
  } catch (error) {
    return error;
  }
};
