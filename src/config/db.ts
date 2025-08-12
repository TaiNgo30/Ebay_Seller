import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectToDatabase(): Promise<typeof mongoose> {
    mongoose.set('strictQuery', true);
    try {
        const conn = await mongoose.connect(env.mongoUri, {
            serverSelectionTimeoutMS: 10_000
        });
        logger.info({ uri: env.mongoUri }, 'Connected to MongoDB');
        return conn;
    } catch (error) {
        logger.error({ err: error }, 'MongoDB connection error');
        throw error;
    }
} 