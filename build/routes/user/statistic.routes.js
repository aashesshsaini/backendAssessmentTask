"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const statistic_validation_1 = __importDefault(require("../../validations/user/statistic.validation"));
const statistic_controller_1 = __importDefault(require("../../controllers/user/statistic.controller"));
const router = express_1.default.Router();
router.get("/topDays", (0, validate_1.validate)(statistic_validation_1.default.topDaysStatistic), statistic_controller_1.default.topDaysStatistic);
router.get("/monthlyChange", (0, validate_1.validate)(statistic_validation_1.default.monthChangeStatistic), statistic_controller_1.default.monthChangeStatistic);
router.get("/prediction", (0, validate_1.validate)(statistic_validation_1.default.statisticPrediction), statistic_controller_1.default.statisticPrediction);
exports.default = router;
