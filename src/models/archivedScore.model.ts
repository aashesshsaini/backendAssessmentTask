import mongoose, { Types, Document, Schema } from "mongoose";
import { ArchivedScoreDocument } from "../interfaces/archivedScore.interface";

const archivedScoreSchema = new Schema<ArchivedScoreDocument>(
    {
    player: {
          type: Schema.Types.ObjectId, ref: 'players'
      },
    region: {
      type: String,
      trim: true,
    },
    mode: {
      type: String,
    },
    score: {
      type:Number
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ArchivedScore = mongoose.model<ArchivedScoreDocument>("archivedScores", archivedScoreSchema);

archivedScoreSchema.index({ player: 1, createdAt: 1 });

export default ArchivedScore;
