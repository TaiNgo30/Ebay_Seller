import dotenv from 'dotenv';

dotenv.config();

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 4000),
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_seller',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    recaptchaSecret: process.env.RECAPTCHA_SECRET || '',
    enableRecaptcha: (process.env.ENABLE_RECAPTCHA || 'false').toLowerCase() === 'true',
    uploadsDir: process.env.UPLOADS_DIR || 'uploads'
}; 