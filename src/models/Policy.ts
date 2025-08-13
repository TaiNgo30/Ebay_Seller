import mongoose, { Schema, Document } from 'mongoose';

export type PolicyType = 'payment' | 'shipping' | 'return';

export interface PolicyDocument extends Document {
    sellerId: mongoose.Types.ObjectId;
    type: PolicyType;
    name: string;
    data: any;
    active: boolean;
}

const PolicySchema = new Schema<PolicyDocument>({
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['payment', 'shipping', 'return'], required: true, index: true },
    name: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
    active: { type: Boolean, default: true }
}, { timestamps: true });

export const PolicyModel = mongoose.model<PolicyDocument>('Policy', PolicySchema); 