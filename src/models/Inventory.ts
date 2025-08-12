import mongoose, { Schema, Document } from 'mongoose';

export interface InventoryDocument extends Document {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    lastUpdated: Date;
}

const InventorySchema = new Schema<InventoryDocument>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true, index: true },
    quantity: { type: Number, required: true },
    lastUpdated: { type: Date, default: () => new Date() }
});

export const InventoryModel = mongoose.model<InventoryDocument>('Inventory', InventorySchema); 