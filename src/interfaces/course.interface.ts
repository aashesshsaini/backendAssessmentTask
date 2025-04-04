import { Document, Schema } from "mongoose";

export interface CourseDocument extends Document {
    price: number;
    priceWithOffer: number;
    title: string;
    videos: string[];
    description: string;
    duration: string;
    isDeleted: false
}
