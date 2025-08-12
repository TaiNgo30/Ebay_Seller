import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { env } from '../config/env.js';
import { StoreModel } from '../models/Store.js';

const router = Router();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), env.uploadsDir)),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
    const user = req.user!;
    const store = await StoreModel.findOne({ sellerId: user._id });
    res.json({
        user: {
            id: user._id,
            username: user.username,
            isSeller: user.isSeller,
            isSellerVerified: user.isSellerVerified,
            sellerRank: user.sellerRank,
            sellerLimits: user.sellerLimits
        }, store
    });
});

const StoreSchema = z.object({
    storeName: z.string().min(2),
    description: z.string().max(1000).optional()
});

router.put('/store', authMiddleware, requireSellerVerified, upload.single('banner'), async (req: AuthRequest, res) => {
    const parse = StoreSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const { storeName, description } = parse.data;
    const bannerImageURL = req.file ? `/uploads/${req.file.filename}` : undefined;
    const sellerId = req.user!._id;
    const store = await StoreModel.findOneAndUpdate(
        { sellerId },
        { storeName, description, ...(bannerImageURL ? { bannerImageURL } : {}) },
        { upsert: true, new: true }
    );
    res.json(store);
});

export default router; 