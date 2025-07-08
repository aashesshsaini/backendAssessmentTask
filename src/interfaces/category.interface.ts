import { Document, Schema } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
  isDeleted: boolean;
}
