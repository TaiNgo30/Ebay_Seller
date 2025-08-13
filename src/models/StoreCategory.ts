import mongoose, { Schema, Document } from 'mongoose';

export interface StoreCategoryDocument extends Document {
    sellerId: mongoose.Types.ObjectId;
    name: string;
    parentId?: mongoose.Types.ObjectId | null;
}

const StoreCategorySchema = new Schema<StoreCategoryDocument>({
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'StoreCategory', default: null }
}, { timestamps: true });

export const StoreCategoryModel = mongoose.model<StoreCategoryDocument>('StoreCategory', StoreCategorySchema); 