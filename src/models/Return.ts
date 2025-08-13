import mongoose, { Schema, Document } from 'mongoose';

export interface ReturnDocument extends Document {
    orderId: mongoose.Types.ObjectId;
    buyerId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    reason: string;
    status: 'requested' | 'approved' | 'rejected' | 'received' | 'refunded';
    rmaNumber?: string;
}

const ReturnSchema = new Schema<ReturnDocument>({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['requested', 'approved', 'rejected', 'received', 'refunded'], default: 'requested', index: true },
    rmaNumber: String
}, { timestamps: true });

export const ReturnModel = mongoose.model<ReturnDocument>('Return', ReturnSchema); 