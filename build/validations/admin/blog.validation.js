"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = void 0;
const joi_1 = __importDefault(require("joi"));
const appConstant_1 = require("../../config/appConstant");
// const createBlog= {
// body: Joi.object().keys({
//         title: Joi.string().required(),
//         mainImage: Joi.string(),
//         introduction: Joi.string().required(),
//         sections:Joi.array().items(
//             Joi.object().keys({
//                 image: Joi.string(),
//                 title: Joi.string(),
//                 description: Joi.string(),
//                 bullets: Joi.string(),
//                 paragraph: Joi.string(),
//             })
//         )
//     })
// }
exports.createBlog = {
    body: joi_1.default.object().keys({
        title: joi_1.default.string().required(),
        introduction: joi_1.default.string().required(),
        sections: joi_1.default.array().items(joi_1.default.object().keys({
            title: joi_1.default.string(),
            description: joi_1.default.string(),
            bullets: joi_1.default.string(),
            paragraph: joi_1.default.string(),
        }))
    }),
    // files: Joi.object().pattern(
    //     Joi.string(),
    //     Joi.array().items(
    //       Joi.object({
    //         fieldname: Joi.string().required(),
    //         originalname: Joi.string().required(),
    //         mimetype: Joi.string()
    //           .valid('image/jpeg', 'image/png', 'image/webp', 'image/jpg')
    //           .required(),
    //         size: Joi.number().max(10 * 1024 * 1024).required(),
    //         buffer: Joi.any().required(),
    //       })
    //     )
    //   )
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
        title: joi_1.default.string(),
        introduction: joi_1.default.string(),
        sections: joi_1.default.array().items(joi_1.default.object().keys({
            title: joi_1.default.string(),
            description: joi_1.default.string(),
            bullets: joi_1.default.string(),
            paragraph: joi_1.default.string(),
        }))
    }),
    files: joi_1.default.object().keys({
        file: joi_1.default.array().items(joi_1.default.object({
            fieldname: joi_1.default.string().pattern(/^mainImage$|^sections\[\d+\]\[image\]$/),
            originalname: joi_1.default.string(),
            mimetype: joi_1.default.string().valid("image/jpeg", "image/png", "image/webp", "image/jpg"),
            size: joi_1.default.number().max(10 * 1024 * 1024),
            buffer: joi_1.default.any(),
        })),
    }),
    //       files: Joi.object().keys({
    //           file:Joi.array().items({
    //               fieldname: Joi.string()
    //               .pattern(/^mainImage$|^sections\[\d+\]\[image\]$/)
    //               ,
    //             originalname: Joi.string(),
    //             mimetype: Joi.string()
    //               .valid("image/jpeg", "image/png", "image/webp", "image/jpg")
    //               ,
    //             size: Joi.number().max(10 * 1024 * 1024), // 10 MB max
    //             buffer: Joi.any(),
    //           })
    //   }),
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
exports.default = { createBlog: exports.createBlog, getBlog, updateBlog, deleteBlog, blogDetails };
