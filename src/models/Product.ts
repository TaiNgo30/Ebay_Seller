import mongoose, { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
    title: string;
    description?: string;
    price: number;
    images: string[];
    categoryId?: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    isAuction: boolean;
    auctionEndTime?: Date;
    status: 'active' | 'hidden' | 'deleted';
    attributes: Record<string, string | number | boolean>;
}

const ProductSchema = new Schema<ProductDocument>(
    {
        title: { type: String, required: true, index: true },
        description: String,
        price: { type: Number, required: true, index: true },
        images: { type: [String], default: [] },
        categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
        sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        isAuction: { type: Boolean, default: false },
        auctionEndTime: Date,
        status: { type: String, enum: ['active', 'hidden', 'deleted'], default: 'active', index: true },
        attributes: { type: Schema.Types.Mixed, default: {} }
    },
    { timestamps: true }
);

ProductSchema.index({ sellerId: 1, status: 1, createdAt: -1 });

export const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema); 