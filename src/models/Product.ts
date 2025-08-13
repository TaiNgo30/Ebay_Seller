import mongoose, { Schema, Document } from 'mongoose';

export interface ProductVariant {
    sku?: string;
    attributes: Record<string, string | number | boolean>;
    price?: number;
    quantity?: number;
    images?: string[];
}

export interface ProductDocument extends Document {
    title: string;
    description?: string;
    price: number;
    images: string[];
    categoryId?: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    isAuction: boolean;
    auctionEndTime?: Date;
    startingBid?: number;
    reservePrice?: number;
    bestOfferEnabled?: boolean;
    status: 'active' | 'hidden' | 'deleted';
    attributes: Record<string, string | number | boolean>;
    specifics?: Record<string, string | number | boolean>;
    variants?: ProductVariant[];
    isDraft?: boolean;
    scheduledAt?: Date;
}

const VariantSchema = new Schema<ProductVariant>({
    sku: String,
    attributes: { type: Schema.Types.Mixed, default: {} },
    price: Number,
    quantity: Number,
    images: { type: [String], default: [] }
}, { _id: false });

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
        startingBid: Number,
        reservePrice: Number,
        bestOfferEnabled: { type: Boolean, default: false },
        status: { type: String, enum: ['active', 'hidden', 'deleted'], default: 'active', index: true },
        attributes: { type: Schema.Types.Mixed, default: {} },
        specifics: { type: Schema.Types.Mixed, default: {} },
        variants: { type: [VariantSchema], default: [] },
        isDraft: { type: Boolean, default: false, index: true },
        scheduledAt: { type: Date, index: true }
    },
    { timestamps: true }
);

ProductSchema.index({ sellerId: 1, status: 1, createdAt: -1 });

export const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema); 