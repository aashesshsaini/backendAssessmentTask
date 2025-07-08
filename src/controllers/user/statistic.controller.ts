import { Request, Response, NextFunction } from "express";
import { userStatisticService } from "../../services";
import { successResponse } from "../../utils/response";
import {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";
import { ExpensesDocument } from "../../interfaces";

const topDaysStatistic = catchAsync(async (req: Request, res: Response) => {
  const topDaysStatisticData = await userStatisticService.topDaysStatistic();
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    topDaysStatisticData
  );
});

const statisticPrediction = catchAsync(async (req: Request, res: Response) => {
  const expensesData = await userStatisticService.statisticPrediction();
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    expensesData
  );
});

const monthChangeStatistic = catchAsync(async (req: Request, res: Response) => {
  const expensesData = await userStatisticService.monthChangeStatistic();
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    expensesData
  );
});

export default {
  topDaysStatistic,
  statisticPrediction,
  monthChangeStatistic,
};
