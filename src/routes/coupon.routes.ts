import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { CouponModel } from '../models/Coupon.js';
import { ProductModel } from '../models/Product.js';

const router = Router();

router.get('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const { page = '1', limit = '50' } = req.query as Record<string, string>;
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(Math.max(parseInt(limit), 1), 100);
    const productIds = await ProductModel.find({ sellerId: req.user!._id }, { _id: 1 }).lean();
    const ids = productIds.map((p) => p._id);
    const [items, total] = await Promise.all([
        CouponModel.find({ productId: { $in: ids } })
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum),
        CouponModel.countDocuments({ productId: { $in: ids } })
    ]);
    res.json({ items, total, page: pageNum, limit: limitNum });
});

const CreateSchema = z.object({
    code: z.string().min(3),
    discountPercent: z.coerce.number().min(1).max(100),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    maxUsage: z.coerce.number().int().min(0).default(0),
    productId: z.string()
});

router.post('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const parse = CreateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const coupon = await CouponModel.create(parse.data as any);
    res.status(201).json(coupon);
});

export default router; 