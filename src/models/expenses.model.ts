import mongoose, { Types, Document, Schema } from "mongoose";
import { ExpensesDocument } from "../interfaces/expneses.interface";

const expensesSchema = new Schema<ExpensesDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "expenses",
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Expenses = mongoose.model<ExpensesDocument>("expenses", expensesSchema);

export default Expenses;
