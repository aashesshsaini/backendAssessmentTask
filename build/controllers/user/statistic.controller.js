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
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const response_1 = require("../../utils/response");
const appConstant_1 = require("../../config/appConstant");
const universalFunctions_1 = require("../../utils/universalFunctions");
const topDaysStatistic = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topDaysStatisticData = yield services_1.userStatisticService.topDaysStatistic();
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, topDaysStatisticData);
}));
const statisticPrediction = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expensesData = yield services_1.userStatisticService.statisticPrediction();
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, expensesData);
}));
const monthChangeStatistic = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expensesData = yield services_1.userStatisticService.monthChangeStatistic();
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, expensesData);
}));
exports.default = {
    topDaysStatistic,
    statisticPrediction,
    monthChangeStatistic,
};
