import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { DisputeModel } from '../models/Dispute.js';

const router = Router();

router.get('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const disputes = await DisputeModel.find({}).sort({ createdAt: -1 }).limit(200);
    res.json(disputes);
});

const ResolveSchema = z.object({ status: z.enum(['in_review', 'resolved', 'rejected']), resolution: z.string().optional() });

router.put('/:id', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const parse = ResolveSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const dispute = await DisputeModel.findByIdAndUpdate(req.params.id, parse.data, { new: true });
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });
    res.json(dispute);
});

export default router; 