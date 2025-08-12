import mongoose, { Schema, Document } from 'mongoose';

export interface ShippingInfoDocument extends Document {
    orderId: mongoose.Types.ObjectId;
    carrier?: string;
    trackingNumber?: string;
    status?: string;
    estimatedArrival?: Date;
}

const ShippingInfoSchema = new Schema<ShippingInfoDocument>({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    carrier: String,
    trackingNumber: String,
    status: String,
    estimatedArrival: Date
}, { timestamps: true });

export const ShippingInfoModel = mongoose.model<ShippingInfoDocument>('ShippingInfo', ShippingInfoSchema); 