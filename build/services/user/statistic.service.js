"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthChangeStatistic = exports.statisticPrediction = exports.topDaysStatistic = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const moment_1 = __importDefault(require("moment"));
const topDaysStatistic = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topDaysStatisticData = yield models_1.Expenses.aggregate([
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
    }
    catch (error) {
        console.log(error, "error...........");
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ERROR, appConstant_1.ERROR_MESSAGES.SERVER_ERROR);
    }
});
exports.topDaysStatistic = topDaysStatistic;
const statisticPrediction = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = (0, moment_1.default)();
        const threeMonthsAgo = now
            .clone()
            .subtract(2, "months")
            .startOf("month")
            .toDate();
        const endOfCurrentMonth = now.clone().endOf("month").toDate();
        const statisticPredictionData = yield models_1.Expenses.aggregate([
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
    }
    catch (error) {
        console.log("Error in statisticPrediction:", error);
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ERROR, appConstant_1.ERROR_MESSAGES.SERVER_ERROR);
    }
});
exports.statisticPrediction = statisticPrediction;
const monthChangeStatistic = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = (0, moment_1.default)();
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
        const result = yield models_1.Expenses.aggregate([
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
    }
    catch (error) {
        console.log("Error in monthChangeStatistic:", error);
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ERROR, appConstant_1.ERROR_MESSAGES.SERVER_ERROR);
    }
});
exports.monthChangeStatistic = monthChangeStatistic;
