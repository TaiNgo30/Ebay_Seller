import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { FeedbackModel } from '../models/Feedback.js';

const router = Router();

const CreateSchema = z.object({ message: z.string().min(5), type: z.enum(['general', 'issue', 'feature']).optional() });

router.post('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const parse = CreateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const fb = await FeedbackModel.create({ sellerId: req.user!._id, message: parse.data.message, type: parse.data.type || 'general' });
    res.status(201).json(fb);
});

export default router; 