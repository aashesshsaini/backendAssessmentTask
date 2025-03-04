import { Document } from "mongoose";

export interface UserDocument extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  age: number;
  gender: string;
  stripeCustomerId: string;
  isPushNotification: boolean;
  isCreatedProfileUser: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}
