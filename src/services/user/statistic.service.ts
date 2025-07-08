import { Expenses, Category } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { ObjectId } from "mongoose";
import moment from "moment";

const topDaysStatistic = async () => {
  try {
    const topDaysStatisticData = await Expenses.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            user: "$user",
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { total: -1 },
      },
      {
        $group: {
          _id: "$_id.user",
          topDays: {
            $push: {
              date: "$_id.date",
              total: "$total",
            },
          },
        },
      },
      {
        $project: {
          user: "$_id",
          topDays: { $slice: ["$topDays", 3] },
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          topDays: 1,
          userData: {
            name: "$userData.name",
            email: "$userData.email",
            status: "$userData.status",
          },
        },
      },
    ]);

    return topDaysStatisticData;
  } catch (error: any) {
    console.log(error, "error...........");
    throw new OperationalError(STATUS_CODES.ERROR, ERROR_MESSAGES.SERVER_ERROR);
  }
};

const statisticPrediction = async () => {
  try {
    const now = moment();
    const threeMonthsAgo = now
      .clone()
      .subtract(2, "months")
      .startOf("month")
      .toDate();
    const endOfCurrentMonth = now.clone().endOf("month").toDate();

    const statisticPredictionData = await Expenses.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: {
            $gte: threeMonthsAgo,
            $lte: endOfCurrentMonth,
          },
        },
      },
      {
        $addFields: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: {
            user: "$user",
            year: "$year",
            month: "$month",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.user",
          predictedNextMonthExpenditure: { $avg: "$total" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $project: {
          _id: 0,
          predictedNextMonthExpenditure: 1,
          userData: {
            name: "$userData.name",
            email: "$userData.email",
            status: "$userData.status",
          },
        },
      },
    ]);

    return statisticPredictionData;
  } catch (error: any) {
    console.log("Error in statisticPrediction:", error);
    throw new OperationalError(STATUS_CODES.ERROR, ERROR_MESSAGES.SERVER_ERROR);
  }
};
const monthChangeStatistic = async () => {
  try {
    const now = moment();
    const previousMonthStart = now
      .clone()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const currentMonthEnd = now.clone().endOf("month").toDate();

    const currentMonth = now.month() + 1; // Jan = 0
    const currentYear = now.year();

    const previousMonth = now.clone().subtract(1, "month").month() + 1;
    const previousYear = now.clone().subtract(1, "month").year();

    console.log(previousMonth, previousYear);

    const result = await Expenses.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: {
            $gte: previousMonthStart,
            $lte: currentMonthEnd,
          },
        },
      },
      {
        $addFields: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { user: "$user", month: "$month", year: "$year" },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.user",
          data: {
            $push: {
              month: "$_id.month",
              year: "$_id.year",
              total: "$total",
            },
          },
        },
      },
      {
        $project: {
          user: "$_id",
          current: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$data",
                  as: "item",
                  cond: {
                    $and: [
                      { $eq: ["$$item.month", currentMonth] },
                      { $eq: ["$$item.year", currentYear] },
                    ],
                  },
                },
              },
              0,
            ],
          },
          previous: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$data",
                  as: "item",
                  cond: {
                    $and: [
                      { $eq: ["$$item.month", previousMonth] },
                      { $eq: ["$$item.year", previousYear] },
                    ],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          user: 1,
          percentageChange: {
            $cond: [
              {
                $or: [
                  { $eq: ["$previous.total", 0] },
                  { $not: "$previous.total" },
                ],
              },
              null,
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$current.total", "$previous.total"] },
                      "$previous.total",
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $project: {
          percentageChange: 1,
          userData: {
            name: "$userData.name",
            email: "$userData.email",
            status: "$userData.status",
          },
        },
      },
    ]);

    return result;
  } catch (error: any) {
    console.log("Error in monthChangeStatistic:", error);
    throw new OperationalError(STATUS_CODES.ERROR, ERROR_MESSAGES.SERVER_ERROR);
  }
};

export { topDaysStatistic, statisticPrediction, monthChangeStatistic };
