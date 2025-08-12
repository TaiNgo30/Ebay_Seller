import mongoose, { Schema, Document } from 'mongoose';

export interface CouponDocument extends Document {
    code: string;
    discountPercent: number;
    startDate: Date;
    endDate: Date;
    maxUsage: number;
    productId: mongoose.Types.ObjectId;
    usedCount: number;
}

const CouponSchema = new Schema<CouponDocument>({
    code: { type: String, required: true, index: true },
    discountPercent: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxUsage: { type: Number, default: 0 },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    usedCount: { type: Number, default: 0 }
}, { timestamps: true });

export const CouponModel = mongoose.model<CouponDocument>('Coupon', CouponSchema); 