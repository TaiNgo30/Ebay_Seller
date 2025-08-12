import mongoose, { Schema, Document } from 'mongoose';

export interface ReviewDocument extends Document {
    productId: mongoose.Types.ObjectId;
    reviewerId: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    createdAt: { type: Date, default: () => new Date() }
});

export const ReviewModel = mongoose.model<ReviewDocument>('Review', ReviewSchema); 