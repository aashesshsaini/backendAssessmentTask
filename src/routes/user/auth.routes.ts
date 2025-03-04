import express, { Router } from "express";
import { validate, validateView } from "../../middlewares/validate";
import validation from "../../validations/user/auth.validation";
import userAuthController from "../../controllers/user/auth.controller";
import auth from "../../middlewares/auth";
import { USER_TYPE } from "../../config/appConstant";
import { Request, Response, NextFunction } from "express";

const router: Router = express.Router();

router.post("/login", validate(validation.login), userAuthController.login);

router.post('/createProfile', validate(validation.createProfile), userAuthController.createProfile)

router.delete(
  "/deleteAccount",
  auth(USER_TYPE.USER),
  validate(validation.deleteAccount),
  userAuthController.deleteAccount
);

router.put(
  "/logout",
  auth(USER_TYPE.USER),
  validate(validation.logout),
  userAuthController.logout
);

router.put(
  "/editProfile",
  auth(USER_TYPE.USER),
  validate(validation.editProfile),
  userAuthController.editProfile
);

router.get(
  "/userInfo",
  auth(USER_TYPE.USER),
  validate(validation.userInfo),
  userAuthController.userInfo
);

router.put('/pushNotificationStatus', auth(USER_TYPE.USER), validate(validation.pushNotificationStatus), userAuthController.pushNotificationStatus)

export default router;
