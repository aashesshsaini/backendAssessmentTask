import { Order, Course } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { paginationOptions } from "../../utils/universalFunctions";
import uploadToS3 from "../../utils/s3Upload"

  const createCourse = async (body: Dictionary, file: Dictionary) => {
    const { title, description, duration, price, priceWithOffer } = body;
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: null,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
  
      let videoUrls: string[] = [];
  
      if (file.video && file.video.length > 0) {
        const files = file.video;
        videoUrls = await Promise.all(files.map((file: any) => uploadToS3(file)));
      }
  
      console.log(videoUrls, 'videoUrls................');
  
      const CourseData = await Course.create({
        title,
        description,
        duration,
        price,
        priceWithOffer,
        videos: videoUrls,
      });
  
      console.log(CourseData);
      return CourseData;
    } catch (error: any) {
      console.log(error, 'error...........');
      throw error;
    }
  };
  
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



const updateCourse = async (body: Dictionary, file:Dictionary) => {
    try {
        const { courseId, title, description, duration, price, priceWithOffer } = body
            const params = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: null,
              Body: file.buffer,
              ContentType: file.mimetype,
            };
        
            let videoUrls: string[] = [];
        
            if (file.video && file.video.length > 0) {
              const files = file.video;
              videoUrls = await Promise.all(files.map((file: any) => uploadToS3(file)));
            }
        const updatedCourseData = await Course.findOneAndUpdate({ _id: courseId, isDeleted: false }, { title, description, video:videoUrls, duration, price, priceWithOffer }, { lean: true, new: true })
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
    const { courseId } = query
    try {
        const deletedCourse = await Course.findByIdAndUpdate(courseId, { isDeleted: true }, { new: true, lean: true })
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
            Order.find(filter, {}, paginationOptions(page, limit)).populate([{ path: "Course", select: "title" }, { path: "user", select: "email mobileNumber fullName" }]),
            Order.countDocuments(filter),
        ]);

        return { orderListing, orderCount };
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}


export { createCourse, getCourse, updateCourse, deleteCourse, courseDetails, orderListing }