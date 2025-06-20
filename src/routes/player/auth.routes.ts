import express, { Router } from "express";
import { validate, validateView } from "../../middlewares/validate";
import validation from "../../validations/user/auth.validation";
import playerAuthController from "../../controllers/player/auth.controller";
import auth from "../../middlewares/auth";
import { USER_TYPE } from "../../config/appConstant";
import { Request, Response, NextFunction } from "express";

const router: Router = express.Router();

router.post("/signup", validate(validation.signup), playerAuthController.signup);

router.post("/login", validate(validation.login), playerAuthController.login);

export default router;
