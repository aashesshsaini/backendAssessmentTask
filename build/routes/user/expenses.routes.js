"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const expenses_validation_1 = __importDefault(require("../../validations/user/expenses.validation"));
const expenses_controller_1 = __importDefault(require("../../controllers/user/expenses.controller"));
const appConstant_1 = require("../../config/appConstant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router
    .route("/")
    .post((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(expenses_validation_1.default.createExpenses), expenses_controller_1.default.createExpenses)
    .put((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(expenses_validation_1.default.updateExpenses), expenses_controller_1.default.updateExpenses)
    .delete((0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(expenses_validation_1.default.deleteExpenses), expenses_controller_1.default.deleteExpenses);
router.post("/createCategory", (0, validate_1.validate)(expenses_validation_1.default.createCategory), expenses_controller_1.default.createCategory);
exports.default = router;
