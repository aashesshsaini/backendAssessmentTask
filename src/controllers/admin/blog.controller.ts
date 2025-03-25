import { Request, Response } from "express";
import { adminBlogService } from "../../services";
import { successResponse } from "../../utils/response";
import {
    SUCCESS_MESSAGES,
    STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";

const createBlog = catchAsync(async (req: Request, res: Response) => {
    const CourseData = await adminBlogService.createBlog(req.body);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        CourseData
    );
});

const getBlog = catchAsync(async (req: Request, res: Response) => {
    const Courses = await adminBlogService.getBlog(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        Courses
    );
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
    const updatedCourse = await adminBlogService.updateBlog(req.body);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        updatedCourse
    );
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const deleteBlog = await adminBlogService.deleteBlog(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        deleteBlog
    );
});

const blogDetails = catchAsync(async (req: Request, res: Response) => {
    const courseData = await adminBlogService.blogDetails(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        courseData
    );
});


export default { createBlog, getBlog, updateBlog, deleteBlog, blogDetails }