import mongoose, { Schema, Document } from 'mongoose';

export interface OrderItemDocument extends Document {
    orderId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    status?: string;
    quantity: number;
    unitPrice: number;
}

const OrderItemSchema = new Schema<OrderItemDocument>({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    status: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
}, { timestamps: true });

export const OrderItemModel = mongoose.model<OrderItemDocument>('OrderItem', OrderItemSchema, 'orderitems'); 