import mongoose, { Schema, Document } from 'mongoose';

export interface SellerLimits {
    maxActiveListings: number;
    maxMonthlySalesAmount: number;
}

export interface UserDocument extends Document {
    username: string;
    fullname?: string;
    email: string;
    password: string;
    role?: 'buyer' | 'seller' | 'admin';
    avatarURL?: string;
    isSeller: boolean;
    isSellerVerified: boolean;
    sellerRank: 'basic' | 'pro' | 'elite';
    sellerLimits: SellerLimits;
    storeId?: mongoose.Types.ObjectId;
}

const SellerLimitsSchema = new Schema<SellerLimits>({
    maxActiveListings: { type: Number, default: 10 },
    maxMonthlySalesAmount: { type: Number, default: 1000 }
});

const UserSchema = new Schema<UserDocument>(
    {
        username: { type: String, required: true, unique: true, index: true },
        fullname: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['buyer', 'seller', 'admin'] },
        avatarURL: { type: String },
        isSeller: { type: Boolean, default: false },
        isSellerVerified: { type: Boolean, default: false, index: true },
        sellerRank: { type: String, enum: ['basic', 'pro', 'elite'], default: 'basic' },
        sellerLimits: { type: SellerLimitsSchema, default: () => ({}) },
        storeId: { type: Schema.Types.ObjectId, ref: 'Store' }
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema); 