import mongoose, { Schema, Document } from 'mongoose';

export interface CategoryDocument extends Document {
    name: string;
}

const CategorySchema = new Schema<CategoryDocument>({
    name: { type: String, required: true, unique: true, index: true }
});

export const CategoryModel = mongoose.model<CategoryDocument>('Category', CategorySchema); 