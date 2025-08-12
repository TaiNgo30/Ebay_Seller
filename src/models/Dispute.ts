import mongoose, { Schema, Document } from 'mongoose';

export interface DisputeDocument extends Document {
    orderId: mongoose.Types.ObjectId;
    raisedBy: mongoose.Types.ObjectId;
    description: string;
    status: 'open' | 'in_review' | 'resolved' | 'rejected';
    resolution?: string;
}

const DisputeSchema = new Schema<DisputeDocument>({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_review', 'resolved', 'rejected'], default: 'open', index: true },
    resolution: String
}, { timestamps: true });

export const DisputeModel = mongoose.model<DisputeDocument>('Dispute', DisputeSchema); 