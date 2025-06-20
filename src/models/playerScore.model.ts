import mongoose, { Types, Document, Schema } from "mongoose";
import { PlayerScoreDocument } from "../interfaces/playerScore.interface";

const playerScoreSchema = new Schema<PlayerScoreDocument>(
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

const PlayerScore = mongoose.model<PlayerScoreDocument>("playerScores", playerScoreSchema);

playerScoreSchema.index({ region: 1, mode: 1 });
playerScoreSchema.index({ player: 1 });

export default PlayerScore;
