import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { ReviewModel } from '../models/Review.js';

const router = Router();

router.get('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const { productId, page = '1', limit = '20' } = req.query as Record<string, string>;
    const filter: any = {};
    if (productId) filter.productId = productId;
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(Math.max(parseInt(limit), 1), 100);
    const [items, total] = await Promise.all([
        ReviewModel.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
        ReviewModel.countDocuments(filter)
    ]);
    res.json({ items, total, page: pageNum, limit: limitNum });
});

export default router; 