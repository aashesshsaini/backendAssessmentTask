"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogDetails = exports.deleteBlog = exports.updateBlog = exports.getBlog = exports.createBlog = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const universalFunctions_1 = require("../../utils/universalFunctions");
// const s3 = new AWS.S3({
//     accessKeyId: config.S3Credentials.accessKeyId,
//     secretAccessKey: config.S3Credentials.secretAccessKey,
//     region:config.S3Credentials.region,
//     // Bucket: config.S3Credentials.accessKeyId,
//     // BucketUrl: config.S3Credentials.accessKeyId,
//   });
const createBlog = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(body, "body.........");
        const blogData = yield models_1.Blog.create(body);
        console.log(blogData);
        return blogData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.createBlog = createBlog;
// const createCourse = async (body: Dictionary) => {
//     // try {
//     //     const params = {
//     //         Bucket: process.env.S3_BUCKET_NAME,
//     //         Key: null,
//     //         Body: file.buffer,
//     //         ContentType: file.mimetype,
//     //       };
//     //     console.log(body, "body.........")
//     //     const CourseData = await Course.create(body)
//     //     console.log(CourseData)
//     //     return CourseData
//     // } catch (error: any) {
//     //     console.log(error, "error...........")
//     //     throw error
//     // }
// }
const getBlog = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, limit = 10, search } = query;
    try {
        var filter = {
            isDeleted: false,
        };
        if (search) {
            filter = Object.assign(Object.assign({}, filter), { $or: [
                    { title: { $regex: RegExp(search, "i") } },
                    { introduction: { $regex: RegExp(search, "i") } },
                ] });
        }
        const [BlogListing, BlogCount] = yield Promise.all([
            models_1.Blog.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
            models_1.Blog.countDocuments(filter),
        ]);
        return { BlogListing, BlogCount };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.getBlog = getBlog;
const updateBlog = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogId, title, mainImage, introduction, sections } = body;
        const updatedBlogData = yield models_1.Blog.findOneAndUpdate({ _id: blogId, isDeleted: false }, { title, mainImage, introduction, sections }, { lean: true, new: true });
        if (!updatedBlogData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.BLOG_NOT_FOUND);
        }
        return updatedBlogData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.updateBlog = updateBlog;
const blogDetails = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = query;
    try {
        const blogData = yield models_1.Blog.findOne({ _id: blogId, isDeleted: false }).lean();
        if (!blogData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.BLOG_NOT_FOUND);
        }
        return blogData;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.blogDetails = blogDetails;
const deleteBlog = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = query;
    try {
        const deletedBlog = yield models_1.Blog.findByIdAndUpdate(blogId, { isDeleted: true }, { new: true, lean: true });
        if (!deletedBlog) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.BLOG_NOT_FOUND);
        }
        return { deletedBlogData: "Blog Delete Successfully" };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.deleteBlog = deleteBlog;
