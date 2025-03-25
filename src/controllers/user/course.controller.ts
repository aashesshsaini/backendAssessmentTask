import { Request, Response } from "express";
import { userCourseService } from "../../services";
import { successResponse } from "../../utils/response";
import {
    SUCCESS_MESSAGES,
    STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";

const getCourses = catchAsync(async (req: Request, res: Response) => {
    const courses = await userCourseService.getCourses(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        courses
    );
});

const courseDetails = catchAsync(async (req: Request, res: Response) => {
    const courseData = await userCourseService.courseDetails(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        courseData
    );
});


const createOrder = catchAsync(async (req: Request, res: Response) => {
    const orderData = await userCourseService.createOrder(req.body, req.token?.user?._id);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        orderData
    );
});

const webhook = catchAsync(async (req: Request, res: Response) => {
    const orderData = await userCourseService.webhook(req.body);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        orderData
    );
});

const myCourses = catchAsync(async (req: Request, res: Response) => {
    const myCourseListing = await userCourseService.myCourses(req.query, req.token?.user?._id);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        myCourseListing
    );
});

const getBlogs = catchAsync(async (req: Request, res: Response) => {
    const blogListing = await userCourseService.getBlogs(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        blogListing
    );
});

const blogDetails = catchAsync(async (req: Request, res: Response) => {
    const blogData = await userCourseService.blogDetails(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        blogData
    );
});


export default { getCourses, courseDetails, createOrder, webhook, myCourses, getBlogs, blogDetails }
