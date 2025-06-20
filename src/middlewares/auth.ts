import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import '../config/passport';
import { USER_TYPE, ERROR_MESSAGES, STATUS_CODES } from '../config/appConstant';
import { AuthFailedError } from '../utils/error';

const verifyCallback = (req: Request, resolve: any, reject: any, expectedRole: string) => async (err: any, token: any, info: any) => {
  if (err || info || !token) {
    console.log('errrrrrrrrrrrr');
    return reject(new AuthFailedError());
  }

  if (expectedRole && token.role !== expectedRole) {
    console.log(token, 'ROLE>>>>>>>>');
    return reject(
      new AuthFailedError(
        ERROR_MESSAGES.UNAUTHORIZED,
        STATUS_CODES.AUTH_FAILED
      )
    );
  }
  if (token.role === USER_TYPE.PLAYER && !token.player) {
    console.log(token.player);
    return reject(new AuthFailedError());
  }
  if (token.role === USER_TYPE.PLAYER) {
    if (!token.player) {
      return reject(new AuthFailedError());
    }
    if (token.player.isDeleted) {
      return reject(
        new AuthFailedError(
          ERROR_MESSAGES.ACCOUNT_DELETED,
          STATUS_CODES.AUTH_FAILED
        )
      );
    }
    if (token.player.isBlocked) {
      return reject(
        new AuthFailedError(
          ERROR_MESSAGES.ACCOUNT_BLOCKED,
          STATUS_CODES.AUTH_FAILED
        )
      );
    }
  }
  req.token = token;
  return resolve();
};

const auth = (expectedRole: string, option?: boolean) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization && option) {
    return next();
  }
  console.log(expectedRole, "expectedRole........")
  return new Promise(async (resolve, reject) => {
    await passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(req, resolve, reject, expectedRole)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
