import Joi from "joi";
import { JOI } from "../../config/appConstant";
import { objectId } from "../custom.validation";

const topDaysStatistic = {
  query: Joi.object().keys({}),
};

const monthChangeStatistic = {
  query: Joi.object().keys({}),
};

const statisticPrediction = {
  query: Joi.object().keys({}),
};

export default {
  topDaysStatistic,
  monthChangeStatistic,
  statisticPrediction,
};
