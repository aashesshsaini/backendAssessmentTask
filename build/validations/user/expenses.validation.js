"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const custom_validation_1 = require("../custom.validation");
const createExpenses = {
    body: joi_1.default.object().keys({
        categoryId: appConstant_1.JOI.OBJECTID,
        amount: joi_1.default.number().required(),
        description: joi_1.default.string(),
    }),
};
const updateExpenses = {
    body: joi_1.default.object().keys({
        expensesId: appConstant_1.JOI.OBJECTID,
        categoryId: joi_1.default.string().custom(custom_validation_1.objectId),
        amount: joi_1.default.number(),
        description: joi_1.default.string(),
    }),
};
const deleteExpenses = {
    query: joi_1.default.object().keys({
        expensesId: appConstant_1.JOI.OBJECTID,
    }),
};
const createCategory = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().required(),
    }),
};
exports.default = {
    createExpenses,
    updateExpenses,
    deleteExpenses,
    createCategory,
};
