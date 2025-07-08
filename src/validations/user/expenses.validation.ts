import Joi from "joi";
import { JOI } from "../../config/appConstant";
import { objectId } from "../custom.validation";

const createExpenses = {
  body: Joi.object().keys({
    categoryId: JOI.OBJECTID,
    amount: Joi.number().required(),
    description: Joi.string(),
  }),
};

const updateExpenses = {
  body: Joi.object().keys({
    expensesId: JOI.OBJECTID,
    categoryId: Joi.string().custom(objectId),
    amount: Joi.number(),
    description: Joi.string(),
  }),
};

const deleteExpenses = {
  query: Joi.object().keys({
    expensesId: JOI.OBJECTID,
  }),
};

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

export default {
  createExpenses,
  updateExpenses,
  deleteExpenses,
  createCategory,
};
