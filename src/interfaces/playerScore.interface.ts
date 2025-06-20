import { Document, Schema } from "mongoose";

export interface PlayerScoreDocument extends Document {
    player: Schema.Types.ObjectId;
    region: string;
    mode: string;
    score: number;
    isDeleted:boolean
}