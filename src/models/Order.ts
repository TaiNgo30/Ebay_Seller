import mongoose, { Schema, Document } from 'mongoose';

export interface OrderItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
}

export interface OrderDocument extends Document {
    buyerId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    orderDate: Date;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'failed' | 'cancelled';
    items: OrderItem[];
}

const OrderItemSchema = new Schema<OrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
});

const OrderSchema = new Schema<OrderDocument>({
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderDate: { type: Date, default: () => new Date(), index: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'failed', 'cancelled'], default: 'pending', index: true },
    items: { type: [OrderItemSchema], default: [] }
}, { timestamps: true });

OrderSchema.index({ sellerId: 1, orderDate: -1 });

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema); 