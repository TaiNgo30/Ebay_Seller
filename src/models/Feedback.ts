import mongoose, { Schema, Document } from 'mongoose';

export interface FeedbackDocument extends Document {
    sellerId: mongoose.Types.ObjectId;
    message: string;
    type: 'general' | 'issue' | 'feature';
    response?: string;
    createdAt: Date;
}

const FeedbackSchema = new Schema<FeedbackDocument>({
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['general', 'issue', 'feature'], default: 'general' },
    response: String,
    createdAt: { type: Date, default: () => new Date() }
});

export const FeedbackModel = mongoose.model<FeedbackDocument>('Feedback', FeedbackSchema); 