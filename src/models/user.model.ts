import mongoose, { Types, Document, Schema } from "mongoose";
import { UserDocument } from "../interfaces/user.interface";

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>("users", userSchema);

export default User;
