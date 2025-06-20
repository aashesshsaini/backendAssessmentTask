import { Document, Schema } from "mongoose";

export interface ArchivedScoreDocument extends Document {
    player: Schema.Types.ObjectId;
    region: string;
    mode: string;
    score: number;
    isDeleted:boolean
}