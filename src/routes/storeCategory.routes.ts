import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { StoreCategoryModel } from '../models/StoreCategory.js';

const router = Router();

router.get('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const items = await StoreCategoryModel.find({ sellerId: req.user!._id }).sort({ createdAt: -1 });
    res.json(items);
});

const CreateSchema = z.object({ name: z.string().min(2), parentId: z.string().nullable().optional() });

router.post('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const parse = CreateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const { name, parentId } = parse.data;
    const item = await StoreCategoryModel.create({ sellerId: req.user!._id, name, parentId: parentId || null });
    res.status(201).json(item);
});

router.put('/:id', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const item = await StoreCategoryModel.findOneAndUpdate({ _id: req.params.id, sellerId: req.user!._id }, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Category not found' });
    res.json(item);
});

router.delete('/:id', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    await StoreCategoryModel.deleteOne({ _id: req.params.id, sellerId: req.user!._id });
    res.json({ ok: true });
});

export default router; 