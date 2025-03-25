import mongoose, { Schema } from "mongoose";
import { BlogDocument } from "../interfaces/blog.interface";

const blogSchema = new Schema<BlogDocument>(
    {
        title: {
            type: String,
            trim: true,
            required: true
        },
        mainImage: {
            type: String,
            trim: true,
        },
        introduction: {
            type: String,
            required: true
        },
       sections:[{
        image: {
            type: String,
            trim: true,
        },
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        bullets: {
            type: String,
            trim: true,
        },
        paragraph: {
            type: String,
            trim: true,
        },
       }],
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Blog = mongoose.model<BlogDocument>("blogs", blogSchema);

export default Blog;
