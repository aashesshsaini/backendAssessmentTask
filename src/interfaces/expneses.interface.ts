import { Document, Schema } from "mongoose";

export interface ExpensesDocument extends Document {
  user: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  amount: number;
  description: string;
  isDeleted: boolean;
}
