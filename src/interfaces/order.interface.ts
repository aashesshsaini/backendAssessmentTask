import { Document, Schema } from "mongoose";

export interface OrderDocument extends Document {
    course: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId
    status: string;
    amount: number;
    isPayment: boolean;
    paymentIntentId: string;
    isDeleted: false
}
