import mongoose, { Schema, Document } from 'mongoose';

export interface MessageDocument extends Document {
    threadId: string;
    productId?: mongoose.Types.ObjectId;
    orderId?: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
}

const MessageSchema = new Schema<MessageDocument>({
    threadId: { type: String, required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: () => new Date() }
});

export const MessageModel = mongoose.model<MessageDocument>('Message', MessageSchema); 