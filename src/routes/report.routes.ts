import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { OrderModel } from '../models/Order.js';

const router = Router();

router.get('/sales', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const { range = 'month' } = req.query as Record<string, string>;
    const now = new Date();
    const start = new Date(now);
    if (range === 'week') start.setDate(now.getDate() - 7);
    else start.setMonth(now.getMonth() - 1);

    const pipeline = [
        { $match: { sellerId: req.user!._id, orderDate: { $gte: start }, status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
        { $group: { _id: { $dateToString: { date: '$orderDate', format: '%Y-%m-%d' } }, orders: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
        { $sort: { _id: 1 } }
    ];

    const data = await OrderModel.aggregate(pipeline as any);
    res.json({ range, data });
});

export default router; 