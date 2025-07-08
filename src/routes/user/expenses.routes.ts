import express, { Router } from "express";
import { validate } from "../../middlewares/validate";
import validation from "../../validations/user/expenses.validation";
import expensesController from "../../controllers/user/expenses.controller";
import { USER_TYPE } from "../../config/appConstant";
import auth from "../../middlewares/auth";

const router: Router = express.Router();

router
  .route("/")
  .post(
    auth(USER_TYPE.USER),
    validate(validation.createExpenses),
    expensesController.createExpenses
  )
  .put(
    auth(USER_TYPE.USER),
    validate(validation.updateExpenses),
    expensesController.updateExpenses
  )
  .delete(
    auth(USER_TYPE.USER),
    validate(validation.deleteExpenses),
    expensesController.deleteExpenses
  );

router.post(
  "/createCategory",
  validate(validation.createCategory),
  expensesController.createCategory
);

export default router;
