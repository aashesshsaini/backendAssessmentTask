import {  Blog } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { paginationOptions } from "../../utils/universalFunctions";
import AWS from "aws-sdk";
import config from "../../config/config"
import uploadToS3 from "../../utils/s3Upload";

// const s3 = new AWS.S3({
//     accessKeyId: config.S3Credentials.accessKeyId,
//     secretAccessKey: config.S3Credentials.secretAccessKey,
//     region:config.S3Credentials.region,
//     // Bucket: config.S3Credentials.accessKeyId,
//     // BucketUrl: config.S3Credentials.accessKeyId,
//   });

const createBlog = async (body: Dictionary, files:Dictionary) => {
    const {title, introduction, sections} = body
    try {
  let mainImageUrl = "";
  if (files["mainImage"] && files["mainImage"][0]) {
    mainImageUrl = await uploadToS3(files["mainImage"][0]);
  }

  const sectionResults = await Promise.all(
    sections.map(async (section: any, index: number) => {
      const imageFieldName = `sections[${index}][image]`;
      let imageUrl = "";

      if (files[imageFieldName] && files[imageFieldName][0]) {
        imageUrl = await uploadToS3(files[imageFieldName][0]);
      }

      return {
        ...section,
        image: imageUrl,
      };
    })
  );
        console.log(body, "body.........")
        const blogData = await Blog.create({title, introduction, mainImage:mainImageUrl, sections:sectionResults})
        console.log(blogData)
        return blogData
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

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

const getBlog = async (query: Dictionary) => {
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
        const [BlogListing, BlogCount] = await Promise.all([
            Blog.find(filter, { }, paginationOptions(page, limit)),
            Blog.countDocuments(filter),
        ]);

        return { BlogListing, BlogCount };
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}



const updateBlog = async (body: Dictionary, files:Dictionary) => {
    const { blogId, title, introduction, sections } = body
    try {
        let mainImageUrl = "";
        if (files["mainImage"] && files["mainImage"][0]) {
          mainImageUrl = await uploadToS3(files["mainImage"][0]);
        }
      
        const sectionResults = await Promise.all(
          sections.map(async (section: any, index: number) => {
            const imageFieldName = `sections[${index}][image]`;
            let imageUrl = "";
      
            if (files[imageFieldName] && files[imageFieldName][0]) {
              imageUrl = await uploadToS3(files[imageFieldName][0]);
            }
      
            return {
              ...section,
              image: imageUrl,
            };
          })
        );
        const updatedBlogData = await Blog.findOneAndUpdate({ _id: blogId, isDeleted: false }, { title, mainImage:mainImageUrl, introduction, sections:sectionResults}, { lean: true, new: true })
        if (!updatedBlogData) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.BLOG_NOT_FOUND
            )
        }
        return updatedBlogData
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


const deleteBlog = async (query: Dictionary) => {
    const { blogId } = query
    try {
        const deletedBlog = await Blog.findByIdAndUpdate(blogId, { isDeleted: true }, { new: true, lean: true })
        if (!deletedBlog) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.BLOG_NOT_FOUND
            )
        }
        return { deletedBlogData: "Blog Delete Successfully" }
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

export { createBlog, getBlog, updateBlog, deleteBlog, blogDetails }