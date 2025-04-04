"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const blog_validation_1 = __importDefault(require("../../validations/admin/blog.validation"));
const blog_controller_1 = __importDefault(require("../../controllers/admin/blog.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const appConstant_1 = require("../../config/appConstant");
const fileUpload_1 = __importDefault(require("../../middlewares/fileUpload"));
const router = express_1.default.Router();
router.route('/')
    .post((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), fileUpload_1.default.any(), (0, validate_1.validate)(blog_validation_1.default.createBlog), blog_controller_1.default.createBlog)
    .get((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(blog_validation_1.default.getBlog), blog_controller_1.default.getBlog)
    .put((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(blog_validation_1.default.updateBlog), blog_controller_1.default.updateBlog)
    .delete((0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(blog_validation_1.default.deleteBlog), blog_controller_1.default.deleteBlog);
router.get('/blogDetails', (0, auth_1.default)(appConstant_1.USER_TYPE.ADMIN), (0, validate_1.validate)(blog_validation_1.default.blogDetails), blog_controller_1.default.blogDetails);
exports.default = router;
