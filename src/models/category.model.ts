import mongoose, { Types, Document, Schema } from "mongoose";
import { CategoryDocument } from "../interfaces/category.interface";

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model<CategoryDocument>("categories", categorySchema);

export default Category;
