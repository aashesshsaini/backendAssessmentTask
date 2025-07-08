import bcrypt from "bcryptjs";
import { Token, User, Expenses, Category } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { ObjectId } from "mongoose";

const createExpenses = async (body: Dictionary, userId: ObjectId) => {
  const { categoryId, amount, description } = body;
  try {
    const expensesData = await Expenses.create({
      user: userId,
      categoryId,
      amount,
      description,
    });
    return expensesData;
  } catch (error: any) {
    console.log(error, "error...........");
    throw new OperationalError(STATUS_CODES.ERROR, ERROR_MESSAGES.SERVER_ERROR);
  }
};

const updateExpenses = async (body: Dictionary, userId: ObjectId) => {
  const { categoryId, amount, description, expensesId } = body;
  try {
    const categoryData = await Category.findById(categoryId).lean();
    if (!categoryData) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.CATEGORY_NOT_FOUND
      );
    }
    const expensesUpdatedData = await Expenses.findOneAndUpdate(
      { _id: expensesId, user: userId },
      {
        category: categoryId,
        amount,
        description,
      },
      {
        new: true,
        lean: true,
      }
    );
    if (!expensesUpdatedData) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.EXPENSES_NOT_FOUND
      );
    }
    return expensesUpdatedData;
  } catch (error: any) {
    console.log(error, "error...........");
    throw new OperationalError(STATUS_CODES.ERROR, ERROR_MESSAGES.SERVER_ERROR);
  }
};

const deleteExpenses = async (query: Dictionary, userId: ObjectId) => {
  const { expensesId } = query;
  try {
    const expensesUpdatedData = await Expenses.findOneAndUpdate(
      { _id: expensesId, user: userId },
      {
        isDeleted: true,
      },
      {
        new: true,
        lean: true,
      }
    );
    if (!expensesUpdatedData) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.EXPENSES_NOT_FOUND
      );
    }
  } catch (error: any) {
    console.log(error, "error...........");
    throw new OperationalError(STATUS_CODES.ERROR, ERROR_MESSAGES.SERVER_ERROR);
  }
};

const createCategory = async (body: Dictionary) => {
  const { name } = body;
  try {
    const categoryData = await Category.create({ name });
    return categoryData;
  } catch (err) {
    console.log(err);
    throw new OperationalError(STATUS_CODES.ERROR, ERROR_MESSAGES.SERVER_ERROR);
  }
};

export { createExpenses, updateExpenses, deleteExpenses, createCategory };
