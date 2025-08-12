import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { CouponModel } from '../models/Coupon.js';

const router = Router();

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