import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { PolicyModel } from '../models/Policy.js';

const router = Router();

router.get('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const items = await PolicyModel.find({ sellerId: req.user!._id }).sort({ createdAt: -1 });
    res.json(items);
});

const CreateSchema = z.object({
    type: z.enum(['payment', 'shipping', 'return']),
    name: z.string().min(2),
    data: z.record(z.any()).default({})
});

router.post('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const parse = CreateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const item = await PolicyModel.create({ sellerId: req.user!._id, ...parse.data });
    res.status(201).json(item);
});

router.put('/:id', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const item = await PolicyModel.findOneAndUpdate({ _id: req.params.id, sellerId: req.user!._id }, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Policy not found' });
    res.json(item);
});

router.delete('/:id', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    await PolicyModel.deleteOne({ _id: req.params.id, sellerId: req.user!._id });
    res.json({ ok: true });
});

export default router; 