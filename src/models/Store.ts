import mongoose, { Schema, Document } from 'mongoose';

export interface StoreDocument extends Document {
    sellerId: mongoose.Types.ObjectId;
    storeName: string;
    bannerImageURL?: string;
    description?: string;
    status?: 'pending' | 'approved' | 'rejected';
}

const StoreSchema = new Schema<StoreDocument>({
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    storeName: { type: String, required: true },
    bannerImageURL: String,
    description: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }
}, { timestamps: true });

export const StoreModel = mongoose.model<StoreDocument>('Store', StoreSchema); 