"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const course_validation_1 = __importDefault(require("../../validations/user/course.validation"));
const course_controller_1 = __importDefault(require("../../controllers/user/course.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(appConstant_1.USER_TYPE.USER), (0, validate_1.validate)(course_validation_1.default.getCourses), course_controller_1.default.getCourses);
// router.post('/addRemoveToCart', auth(USER_TYPE.USER), validate(validation.addRemoveToCart), userCourseController.addRemoveToCart)
// router.post('/createOrder', auth(USER_TYPE.USER), validate(validation.createOrder), userCourseController.createOrder)
// router.post('/webhook', userCourseController.webhook)
exports.default = router;
