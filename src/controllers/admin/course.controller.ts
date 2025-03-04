import { Request, Response } from "express";
import { adminCourseService } from "../../services";
import { successResponse } from "../../utils/response";
import {
    SUCCESS_MESSAGES,
    STATUS_CODES,
} from "../../config/appConstant";
import { catchAsync } from "../../utils/universalFunctions";

const createCourse = catchAsync(async (req: Request, res: Response) => {
    const CourseData = await adminCourseService.createCourse(req.body);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        CourseData
    );
});

const getCourse = catchAsync(async (req: Request, res: Response) => {
    const Courses = await adminCourseService.getCourse(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        Courses
    );
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
    const updatedCourse = await adminCourseService.updateCourse(req.body);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        updatedCourse
    );
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
    const deleteCourse = await adminCourseService.deleteCourse(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        deleteCourse
    );
});

const courseDetails = catchAsync(async (req: Request, res: Response) => {
    const courseData = await adminCourseService.courseDetails(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        courseData
    );
});

const orderListing = catchAsync(async (req: Request, res: Response) => {
    const Courses = await adminCourseService.orderListing(req.query);
    return successResponse(
        req,
        res,
        STATUS_CODES.SUCCESS,
        SUCCESS_MESSAGES.SUCCESS,
        Courses
    );
});

export default { createCourse, getCourse, updateCourse, deleteCourse, courseDetails, orderListing }