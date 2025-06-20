import { Document, Schema, Types } from "mongoose";

export interface TokenDocument extends Document {
  token: string;
  player: Schema.Types.ObjectId;
  role: string;
  type: string;
  expires: Date;
  device: {
    type: string;
    token: string;
    id: string;
  };
  otp?: {
    code: string,
    expiresAt: string
  };

  isDeleted: boolean;
  blacklisted: boolean;
}