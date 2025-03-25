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
exports.blogDetails = exports.getBlogs = exports.myCourses = exports.webhook = exports.createOrder = exports.courseDetails = exports.getCourses = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const universalFunctions_1 = require("../../utils/universalFunctions");
// import redisClient from '../../utils/redis';
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config/config"));
const sendMails_1 = require("../../libs/sendMails");
const stripeInstance = new stripe_1.default(config_1.default.stripeSecretKey);
const getCourses = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, limit = 10, search } = query;
    const cacheKey = `Courses:page=${page}:limit=${limit}:search=${search || 'all'}`;
    try {
        // const cachedData = await redisClient.get(cacheKey);
        // if (cachedData) {
        //     console.log("Fetching from Redis Cache...");
        //     return JSON.parse(cachedData);
        // }
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
            models_1.Course.find(filter, { title: 1, video: 1, duration: 1, price: 1, priceWithOffer: 1 }, (0, universalFunctions_1.paginationOptions)(page, limit)),
            models_1.Course.countDocuments(filter),
        ]);
        const result = { CourseListing, CourseCount };
        // const redisData = await redisClient.setEx(cacheKey, 36, JSON.stringify(result));
        return result;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.getCourses = getCourses;
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
const createOrder = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { CourseId } = body;
    try {
        const courseData = yield models_1.Course.findOne({ _id: CourseId, isDeleted: false });
        if (!courseData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.COURSE_NOT_FOUND);
        }
        const amount = courseData.priceWithOffer;
        const orderData = yield models_1.Order.create({ Course: CourseId, user: userId, amount });
        const orderIdForMetaData = orderData._id;
        const metadata = {
            userId: userId.toString() || "",
            amount: (amount * 100).toString(),
            orderId: orderIdForMetaData.toString(),
        };
        const session = yield stripeInstance.checkout.sessions.create({
            success_url: "https://successUrl.com",
            cancel_url: "https://cancelUrl.com",
            payment_method_types: ["card"],
            customer: userId.toString(),
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "grow with Pankaj order",
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            payment_intent_data: {
                metadata: metadata,
            },
            metadata: metadata,
            mode: "payment",
        });
        return { orderData, session };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.createOrder = createOrder;
const webhook = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = event.data.object;
        const paymentIntentId = event.data.object.id;
        const { userId, orderId, quantity } = paymentIntent.metadata;
        switch (event.type) {
            case "payment_intent.succeeded":
                const orderData = yield models_1.Order.findById(orderId);
                if (!orderData) {
                    throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "Order not found");
                }
                const [userData, CourseUpdatedData] = yield Promise.all([
                    models_1.User.findById(userId),
                    models_1.Order.updateOne({ _id: orderId }, { isPayment: true, paymentIntentId }),
                ]);
                (0, sendMails_1.orderPlacedEmail)(userData === null || userData === void 0 ? void 0 : userData.email, userData === null || userData === void 0 ? void 0 : userData.firstName, CourseUpdatedData === null || CourseUpdatedData === void 0 ? void 0 : CourseUpdatedData.CourseName, orderData.amount, quantity);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.webhook = webhook;
const myCourses = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = query;
    try {
        const [myCoursesLiting, myCoursesCount] = yield Promise.all([
            models_1.Order.find({ user: userId, isPayment: true, isDeleted: false }, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
            models_1.Order.countDocuments({ user: userId, isPayment: true, isDeleted: false })
        ]);
        return { myCoursesLiting, myCoursesCount };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.myCourses = myCourses;
const getBlogs = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [blogListing, blogCount] = yield Promise.all([
            models_1.Blog.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
            models_1.Blog.countDocuments(filter),
        ]);
        return { blogListing, blogCount };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.getBlogs = getBlogs;
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
