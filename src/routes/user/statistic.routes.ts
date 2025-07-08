import express, { Router } from "express";
import { validate } from "../../middlewares/validate";
import validation from "../../validations/user/statistic.validation";
import statisticController from "../../controllers/user/statistic.controller";
import { USER_TYPE } from "../../config/appConstant";
import auth from "../../middlewares/auth";

const router: Router = express.Router();

router.get(
  "/topDays",
  validate(validation.topDaysStatistic),
  statisticController.topDaysStatistic
);

router.get(
  "/monthlyChange",
  validate(validation.monthChangeStatistic),
  statisticController.monthChangeStatistic
);

router.get(
  "/prediction",
  validate(validation.statisticPrediction),
  statisticController.statisticPrediction
);

export default router;
