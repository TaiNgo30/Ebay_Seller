import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { ReturnModel } from '../models/Return.js';

const router = Router();

router.get('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const { status } = req.query as { status?: string };
    const query: any = { sellerId: req.user!._id };
    if (status) query.status = status;
    const items = await ReturnModel.find(query).sort({ createdAt: -1 });
    res.json(items);
});

const UpdateSchema = z.object({ status: z.enum(['approved', 'rejected', 'received', 'refunded']), rmaNumber: z.string().optional() });

router.put('/:id', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const parse = UpdateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const item = await ReturnModel.findOneAndUpdate({ _id: req.params.id, sellerId: req.user!._id }, parse.data, { new: true });
    if (!item) return res.status(404).json({ message: 'Return not found' });
    res.json(item);
});

export default router; 