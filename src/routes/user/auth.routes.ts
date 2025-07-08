import express, { Router } from "express";
import { validate } from "../../middlewares/validate";
import validation from "../../validations/user/auth.validation";
import userAuthController from "../../controllers/user/auth.controller";

const router: Router = express.Router();

router.post("/signup", validate(validation.signup), userAuthController.signup);

router.post("/login", validate(validation.login), userAuthController.login);

export default router;
