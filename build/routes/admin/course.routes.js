"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const course_validation_1 = __importDefault(require("../../validations/admin/course.validation"));
const course_controller_1 = __importDefault(require("../../controllers/admin/course.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const router = express_1.default.Router();
router.route('/')
    .post((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(course_validation_1.default.createCourse), course_controller_1.default.createCourse)
    .get((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(course_validation_1.default.getCourse), course_controller_1.default.getCourse)
    .put((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(course_validation_1.default.updateCourse), course_controller_1.default.updateCourse)
    .delete((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(course_validation_1.default.deleteCourse), course_controller_1.default.deleteCourse);
router.get('/courseDetails', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(course_validation_1.default.courseDetails), course_controller_1.default.courseDetails);
router.get('/orderListing', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(course_validation_1.default.orderListing), course_controller_1.default.orderListing);
exports.default = router;
