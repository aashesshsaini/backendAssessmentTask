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
exports.createCategory = exports.deleteExpenses = exports.updateExpenses = exports.createExpenses = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const createExpenses = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, amount, description } = body;
    try {
        const expensesData = yield models_1.Expenses.create({
            user: userId,
            categoryId,
            amount,
            description,
        });
        return expensesData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ERROR, appConstant_1.ERROR_MESSAGES.SERVER_ERROR);
    }
});
exports.createExpenses = createExpenses;
const updateExpenses = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, amount, description, expensesId } = body;
    try {
        const categoryData = yield models_1.Category.findById(categoryId).lean();
        if (!categoryData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.CATEGORY_NOT_FOUND);
        }
        const expensesUpdatedData = yield models_1.Expenses.findOneAndUpdate({ _id: expensesId, user: userId }, {
            category: categoryId,
            amount,
            description,
        }, {
            new: true,
            lean: true,
        });
        if (!expensesUpdatedData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.EXPENSES_NOT_FOUND);
        }
        return expensesUpdatedData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ERROR, appConstant_1.ERROR_MESSAGES.SERVER_ERROR);
    }
});
exports.updateExpenses = updateExpenses;
const deleteExpenses = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { expensesId } = query;
    try {
        const expensesUpdatedData = yield models_1.Expenses.findOneAndUpdate({ _id: expensesId, user: userId }, {
            isDeleted: true,
        }, {
            new: true,
            lean: true,
        });
        if (!expensesUpdatedData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.EXPENSES_NOT_FOUND);
        }
    }
    catch (error) {
        console.log(error, "error...........");
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ERROR, appConstant_1.ERROR_MESSAGES.SERVER_ERROR);
    }
});
exports.deleteExpenses = deleteExpenses;
const createCategory = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = body;
    try {
        const categoryData = yield models_1.Category.create({ name });
        return categoryData;
    }
    catch (err) {
        console.log(err);
        throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ERROR, appConstant_1.ERROR_MESSAGES.SERVER_ERROR);
    }
});
exports.createCategory = createCategory;
