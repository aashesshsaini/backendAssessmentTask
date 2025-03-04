import mongoose, { Schema } from "mongoose";
import { CourseDocument } from "../interfaces/course.interface";

const courseSchema = new Schema<CourseDocument>(
    {
        title: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true,
            required: true
        },
        video: {
            type: String,
            required: true
        },
        duration: {
            type: String
        },
        priceWithOffer: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Course = mongoose.model<CourseDocument>("courses", courseSchema);

export default Course;
