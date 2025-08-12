import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { InventoryModel } from '../models/Inventory.js';

const router = Router();

router.get('/:productId', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const inv = await InventoryModel.findOne({ productId: req.params.productId });
    if (!inv) return res.status(404).json({ message: 'Inventory not found' });
    res.json(inv);
});

const UpdateSchema = z.object({ quantity: z.coerce.number().int().min(0) });

router.put('/:productId', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const parse = UpdateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const { quantity } = parse.data;
    const inv = await InventoryModel.findOneAndUpdate(
        { productId: req.params.productId },
        { quantity, lastUpdated: new Date() },
        { new: true }
    );
    if (!inv) return res.status(404).json({ message: 'Inventory not found' });
    res.json(inv);
});

export default router; 