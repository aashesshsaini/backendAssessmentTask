import { Document } from "mongoose";

export interface PlayerDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  countryCode: string;
  age: number;
  gender: string;
  region: string;
  isBlocked: boolean;
  isDeleted: boolean;
}
