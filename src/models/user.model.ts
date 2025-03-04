import mongoose, { Types, Document, Schema } from "mongoose";
import { USER_TYPE } from "../config/appConstant";
import { UserDocument } from "../interfaces/user.interface";
import { string } from "joi";

const userSchema = new Schema<UserDocument>(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    age: {
      type: Number
    },
    gender: {
      type: String
    },
    stripeCustomerId: { type: String },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isCreatedProfileUser: {
      type: Boolean,
      default: false,
    },
    isPushNotification: {
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
