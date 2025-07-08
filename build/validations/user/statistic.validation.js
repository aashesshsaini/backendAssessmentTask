"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const topDaysStatistic = {
    query: joi_1.default.object().keys({}),
};
const monthChangeStatistic = {
    query: joi_1.default.object().keys({}),
};
const statisticPrediction = {
    query: joi_1.default.object().keys({}),
};
exports.default = {
    topDaysStatistic,
    monthChangeStatistic,
    statisticPrediction,
};
