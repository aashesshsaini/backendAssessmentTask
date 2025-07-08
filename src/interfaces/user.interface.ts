import { Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isBlocked: boolean;
  isDeleted: boolean;
}
