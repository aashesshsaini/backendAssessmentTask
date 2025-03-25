import { Order, Course, Token, User, Blog } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES, CART_ACTION_CASE } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { paginationOptions } from "../../utils/universalFunctions";
// import redisClient from '../../utils/redis';
import Stripe from "stripe"
import config from "../../config/config";
import { orderPlacedEmail } from "../../libs/sendMails";
import { ObjectId } from "mongoose";
const stripeInstance = new Stripe(config.stripeSecretKey);

const getCourses = async (query: Dictionary) => {
    const { page = 0, limit = 10, search } = query
    const cacheKey = `Courses:page=${page}:limit=${limit}:search=${search || 'all'}`;
    try {
        // const cachedData = await redisClient.get(cacheKey);
        // if (cachedData) {
        //     console.log("Fetching from Redis Cache...");
        //     return JSON.parse(cachedData);
        // }
        var filter: {
            isDeleted: boolean;
            $or?: Array<
                | { title?: { $regex: RegExp } }
                | { description?: { $regex: RegExp } }

            >;
        } = {
            isDeleted: false,
        };

        if (search) {
            filter = {
                ...filter,
                $or: [
                    { title: { $regex: RegExp(search, "i") } },
                    { description: { $regex: RegExp(search, "i") } },
                ],
            };
        }
        const [CourseListing, CourseCount] = await Promise.all([
            Course.find(filter, { title: 1, video: 1, duration: 1, price: 1, priceWithOffer: 1 }, paginationOptions(page, limit)),
            Course.countDocuments(filter),
        ]);

        const result = { CourseListing, CourseCount };
        // const redisData = await redisClient.setEx(cacheKey, 36, JSON.stringify(result));
        return result;
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

const courseDetails = async (query: Dictionary) => {
    const { courseId } = query
    try {
        const courseData = await Course.findOne({ _id: courseId, isDeleted: false }).lean()
        if (!courseData) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.COURSE_NOT_FOUND
            )
        }
        return courseData
    } catch (error) {
        console.log(error)
        throw error
    }
}

const createOrder = async (body: Dictionary, userId: ObjectId) => {
    const { CourseId } = body
    try {
        const courseData = await Course.findOne({ _id: CourseId, isDeleted: false })
        if (!courseData) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.COURSE_NOT_FOUND
            )
        }

        const amount = courseData.priceWithOffer
        const orderData = await Order.create({ Course: CourseId, user: userId, amount })
        const orderIdForMetaData = orderData._id as ObjectId;

        const metadata: Dictionary = {
            userId: userId.toString() || "",
            amount: (amount * 100).toString(),
            orderId: orderIdForMetaData.toString(),
        };

        const session = await stripeInstance.checkout.sessions.create({
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

        return { orderData, session }
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

const webhook = async (event: Dictionary) => {
    try {
        const paymentIntent = event.data.object;
        const paymentIntentId = event.data.object.id;
        const { userId, orderId, quantity } = paymentIntent.metadata

        switch (event.type) {
            case "payment_intent.succeeded":
                const orderData = await Order.findById(orderId);
                if (!orderData) {
                    throw new OperationalError(
                        STATUS_CODES.ACTION_FAILED,
                        "Order not found"
                    );
                }
                const [userData, CourseUpdatedData] = await Promise.all([
                    User.findById(userId) as Dictionary,
                    Order.updateOne({ _id: orderId }, { isPayment: true, paymentIntentId }) as Dictionary,
                ]);
                orderPlacedEmail(userData?.email, userData?.firstName, CourseUpdatedData?.CourseName, orderData.amount, quantity)
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }

};

const myCourses = async (query: Dictionary, userId: ObjectId) => {
    const { page, limit } = query
    try {
        const [myCoursesLiting, myCoursesCount] = await Promise.all([
            Order.find({ user: userId, isPayment: true, isDeleted: false }, {}, paginationOptions(page, limit)),
            Order.countDocuments({ user: userId, isPayment: true, isDeleted: false })
        ])
        return { myCoursesLiting, myCoursesCount }
    } catch (error) {
        console.log(error)
        throw error
    }
}

const getBlogs = async (query: Dictionary) => {
    const { page = 0, limit = 10, search } = query
    try {
        var filter: {
            isDeleted: boolean;
            $or?: Array<
                | { title?: { $regex: RegExp } }
                | { introduction?: { $regex: RegExp } }

            >;
        } = {
            isDeleted: false,
        };

        if (search) {
            filter = {
                ...filter,
                $or: [
                    { title: { $regex: RegExp(search, "i") } },
                    { introduction: { $regex: RegExp(search, "i") } },
                ],
            };
        }
        const [blogListing, blogCount] = await Promise.all([
            Blog.find(filter, { }, paginationOptions(page, limit)),
            Blog.countDocuments(filter),
        ]);

        return { blogListing, blogCount };
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

const blogDetails = async (query: Dictionary) => {
    const { blogId } = query
    try {
        const blogData = await Blog.findOne({ _id: blogId, isDeleted: false }).lean()
        if (!blogData) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.BLOG_NOT_FOUND
            )
        }
        return blogData
    } catch (error) {
        console.log(error)
        throw error
    }
}


export { getCourses, courseDetails, createOrder, webhook, myCourses, getBlogs, blogDetails }