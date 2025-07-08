import { Request, Response, NextFunction } from "express";
import { userExpensesService } from "../../services";
import { successResponse } from "../../utils/response";
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";
import { formatSignUpUser, formatUser } from "../../utils/formatResponse";
import { ExpensesDocument, UserDocument } from "../../interfaces";

const createExpenses = catchAsync(async (req: Request, res: Response) => {
  const expensesData = (await userExpensesService.createExpenses(
    req.body,
    req.token.user._id
  )) as ExpensesDocument;
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    expensesData
  );
});

const updateExpenses = catchAsync(async (req: Request, res: Response) => {
  const expensesUpdatedData = (await userExpensesService.updateExpenses(
    req.body,
    req.token.user._id
  )) as ExpensesDocument;

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    expensesUpdatedData
  );
});

const deleteExpenses = catchAsync(async (req: Request, res: Response) => {
  await userExpensesService.deleteExpenses(req.query, req.token.user._id);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    "Expenses Delete Successfully"
  );
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryData = await userExpensesService.createCategory(req.body);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    categoryData
  );
});

export default {
  createExpenses,
  updateExpenses,
  deleteExpenses,
  createCategory,
};
