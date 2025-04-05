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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogDetails = exports.deleteBlog = exports.updateBlog = exports.getBlog = exports.createBlog = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const universalFunctions_1 = require("../../utils/universalFunctions");
const s3Upload_1 = __importDefault(require("../../utils/s3Upload"));
const createBlog = (body, files) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, introduction, sections } = body;
    const groupedFiles = {};
    files.forEach((file) => {
        if (!groupedFiles[file.fieldname])
            groupedFiles[file.fieldname] = [];
        groupedFiles[file.fieldname].push(file);
    });
    try {
        let mainImageUrl = "";
        if (groupedFiles["mainImage"] && groupedFiles["mainImage"][0]) {
            mainImageUrl = yield (0, s3Upload_1.default)(groupedFiles["mainImage"][0]);
        }
        const sectionResults = yield Promise.all(sections.map((section, index) => __awaiter(void 0, void 0, void 0, function* () {
            const imageFieldName = `sections[${index}][image]`;
            let imageUrl = "";
            if (groupedFiles[imageFieldName] && groupedFiles[imageFieldName][0]) {
                imageUrl = yield (0, s3Upload_1.default)(groupedFiles[imageFieldName][0]);
            }
            return Object.assign(Object.assign({}, section), { image: imageUrl });
        })));
        const blogData = yield models_1.Blog.create({
            title,
            introduction,
            mainImage: mainImageUrl,
            sections: sectionResults,
        });
        return blogData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.createBlog = createBlog;
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
const updateBlog = (body, files) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId, title, introduction, sections } = body;
    try {
        let mainImageUrl = "";
        if (files["mainImage"] && files["mainImage"][0]) {
            mainImageUrl = yield (0, s3Upload_1.default)(files["mainImage"][0]);
        }
        const sectionResults = yield Promise.all(sections.map((section, index) => __awaiter(void 0, void 0, void 0, function* () {
            const imageFieldName = `sections[${index}][image]`;
            let imageUrl = "";
            if (files[imageFieldName] && files[imageFieldName][0]) {
                imageUrl = yield (0, s3Upload_1.default)(files[imageFieldName][0]);
            }
            return Object.assign(Object.assign({}, section), { image: imageUrl });
        })));
        const updatedBlogData = yield models_1.Blog.findOneAndUpdate({ _id: blogId, isDeleted: false }, { title, mainImage: mainImageUrl, introduction, sections: sectionResults }, { lean: true, new: true });
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
