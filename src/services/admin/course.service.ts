import { Order, Course } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { paginationOptions } from "../../utils/universalFunctions";

const createCourse = async (body: Dictionary) => {
    try {
        console.log(body, "body.........")
        const CourseData = await Course.create(body)
        console.log(CourseData)
        return CourseData
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

const getCourse = async (query: Dictionary) => {
    const { page = 0, limit = 10, search } = query
    try {
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
            Course.find(filter, { }, paginationOptions(page, limit)),
            Course.countDocuments(filter),
        ]);

        return { CourseListing, CourseCount };
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}



const updateCourse = async (body: Dictionary) => {
    try {
        const { courseId, title, description, video, duration, price, priceWithOffer } = body
        const updatedCourseData = await Course.findOneAndUpdate({ _id: courseId, isDeleted: false }, { title, description, video, duration, price, priceWithOffer }, { lean: true, new: true })
        if (!updatedCourseData) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.COURSE_NOT_FOUND
            )
        }
        return updatedCourseData
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


const deleteCourse = async (query: Dictionary) => {
    const { CourseId } = query
    try {
        const deletedCourse = await Course.findByIdAndUpdate(CourseId, { isDeleted: true }, { new: true, lean: true })
        if (!deletedCourse) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.COURSE_NOT_FOUND
            )
        }
        return { deletedCourseData: "Course Delete Successfully" }
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

const orderListing = async (query: Dictionary) => {
    const { page = 0, limit = 10, search } = query
    try {
        var filter: {
            isDeleted: boolean;
            isPayment: boolean;
            $or?: Array<
                | { CourseName?: { $regex: RegExp } }
            >;
        } = {
            isDeleted: false,
            isPayment: true
        };
        const [orderListing, orderCount] = await Promise.all([
            Order.find(filter, {}, paginationOptions(page, limit)).populate([{ path: "Course", select: "CourseName" }, { path: "user", select: "email firstName lastName" }]),
            Order.countDocuments(filter),
        ]);

        return { orderListing, orderCount };
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}


export { createCourse, getCourse, updateCourse, deleteCourse, courseDetails, orderListing }