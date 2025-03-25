"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
const createBlog = {
    body: joi_1.default.object().keys({
        title: joi_1.default.string().required(),
        mainImage: joi_1.default.string(),
        introduction: joi_1.default.string().required(),
        sections: joi_1.default.array().items(joi_1.default.object().keys({
            image: joi_1.default.string(),
            title: joi_1.default.string(),
            description: joi_1.default.string(),
            bullets: joi_1.default.string(),
            paragraph: joi_1.default.string(),
        }))
    })
};
const getBlog = {
    query: joi_1.default.object().keys({
        page: appConstant_1.JOI.PAGE,
        limit: appConstant_1.JOI.LIMIT,
        search: joi_1.default.string().allow('')
    })
};
const updateBlog = {
    body: joi_1.default.object().keys({
        blogId: appConstant_1.JOI.OBJECTID,
        title: joi_1.default.string(),
        mainImage: joi_1.default.string(),
        introduction: joi_1.default.string(),
        sections: joi_1.default.array().items(joi_1.default.object().keys({
            image: joi_1.default.string(),
            title: joi_1.default.string(),
            description: joi_1.default.string(),
            bullets: joi_1.default.string(),
            paragraph: joi_1.default.string(),
        }))
    })
};
const deleteBlog = {
    query: joi_1.default.object().keys({
        blogId: appConstant_1.JOI.OBJECTID
    })
};
const blogDetails = {
    query: joi_1.default.object().keys({
        blogId: appConstant_1.JOI.OBJECTID
    })
};
exports.default = { createBlog, getBlog, updateBlog, deleteBlog, blogDetails };
