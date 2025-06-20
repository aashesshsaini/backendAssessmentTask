import mongoose, { Types, Document, Schema } from "mongoose";
import { PlayerDocument } from "../interfaces/player.interface";

const playerSchema = new Schema<PlayerDocument>(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
    },
    password: {
      type:String
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
    region: {
      type: String
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

const Player = mongoose.model<PlayerDocument>("players", playerSchema);

export default Player;
