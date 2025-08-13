import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { MessageModel } from '../models/Message.js';

const router = Router();

router.get('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const { threadId } = req.query as { threadId?: string };
    if (!threadId) return res.status(400).json({ message: 'threadId required' });
    const msgs = await MessageModel.find({ threadId }).sort({ timestamp: 1 });
    res.json(msgs);
});

const SendSchema = z.object({ threadId: z.string(), receiverId: z.string(), content: z.string().min(1), productId: z.string().optional(), orderId: z.string().optional() });

router.post('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const parse = SendSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const { threadId, receiverId, content, productId, orderId } = parse.data;
    const msg = await MessageModel.create({ threadId, receiverId, content, senderId: req.user!._id, productId, orderId });
    res.status(201).json(msg);
});

export default router; 