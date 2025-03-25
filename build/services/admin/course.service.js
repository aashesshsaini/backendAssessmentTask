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
exports.orderListing = exports.courseDetails = exports.deleteCourse = exports.updateCourse = exports.getCourse = exports.createCourse = void 0;
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
const createCourse = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(body, "body.........");
        const CourseData = yield models_1.Course.create(body);
        console.log(CourseData);
        return CourseData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.createCourse = createCourse;
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
const getCourse = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, limit = 10, search } = query;
    try {
        var filter = {
            isDeleted: false,
        };
        if (search) {
            filter = Object.assign(Object.assign({}, filter), { $or: [
                    { title: { $regex: RegExp(search, "i") } },
                    { description: { $regex: RegExp(search, "i") } },
                ] });
        }
        const [CourseListing, CourseCount] = yield Promise.all([
            models_1.Course.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
            models_1.Course.countDocuments(filter),
        ]);
        return { CourseListing, CourseCount };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.getCourse = getCourse;
const updateCourse = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, title, description, video, duration, price, priceWithOffer } = body;
        const updatedCourseData = yield models_1.Course.findOneAndUpdate({ _id: courseId, isDeleted: false }, { title, description, video, duration, price, priceWithOffer }, { lean: true, new: true });
        if (!updatedCourseData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.COURSE_NOT_FOUND);
        }
        return updatedCourseData;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.updateCourse = updateCourse;
const courseDetails = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = query;
    try {
        const courseData = yield models_1.Course.findOne({ _id: courseId, isDeleted: false }).lean();
        if (!courseData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.COURSE_NOT_FOUND);
        }
        return courseData;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.courseDetails = courseDetails;
const deleteCourse = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = query;
    try {
        const deletedCourse = yield models_1.Course.findByIdAndUpdate(courseId, { isDeleted: true }, { new: true, lean: true });
        if (!deletedCourse) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.COURSE_NOT_FOUND);
        }
        return { deletedCourseData: "Course Delete Successfully" };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.deleteCourse = deleteCourse;
const orderListing = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, limit = 10, search } = query;
    try {
        var filter = {
            isDeleted: false,
            isPayment: true
        };
        const [orderListing, orderCount] = yield Promise.all([
            models_1.Order.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)).populate([{ path: "Course", select: "title" }, { path: "user", select: "email mobileNumber fullName" }]),
            models_1.Order.countDocuments(filter),
        ]);
        return { orderListing, orderCount };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.orderListing = orderListing;
