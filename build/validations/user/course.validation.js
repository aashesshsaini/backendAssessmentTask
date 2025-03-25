"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const getCourses = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        search: joi_1.default.string().allow('')
    })
};
const courseDetails = {
    query: joi_1.default.object().keys({
        courseId: appConstant_1.JOI.OBJECTID
    })
};
const createOrder = {
    body: joi_1.default.object().keys({
        courseId: appConstant_1.JOI.OBJECTID,
    })
};
const myCourses = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT
    })
};
const getBlogs = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        search: joi_1.default.string().allow('')
    })
};
const blogDetails = {
    query: joi_1.default.object().keys({
        blogId: appConstant_1.JOI.OBJECTID
    })
};
exports.default = { getCourses, courseDetails, createOrder, myCourses, getBlogs, blogDetails };
