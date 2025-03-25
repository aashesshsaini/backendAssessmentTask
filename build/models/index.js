"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = exports.Order = exports.Course = exports.Admin = exports.User = exports.Token = void 0;
const token_model_1 = __importDefault(require("./token.model"));
exports.Token = token_model_1.default;
const user_model_1 = __importDefault(require("./user.model"));
exports.User = user_model_1.default;
const admin_model_1 = __importDefault(require("./admin.model"));
exports.Admin = admin_model_1.default;
const course_model_1 = __importDefault(require("./course.model"));
exports.Course = course_model_1.default;
const order_model_1 = __importDefault(require("./order.model"));
exports.Order = order_model_1.default;
const blog_model_1 = __importDefault(require("./blog.model"));
exports.Blog = blog_model_1.default;
