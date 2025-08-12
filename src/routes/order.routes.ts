import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { OrderModel } from '../models/Order.js';
import { ShippingInfoModel } from '../models/ShippingInfo.js';
import { OrderItemModel } from '../models/OrderItem.js';

const router = Router();

router.get('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const { page = '1', limit = '20', status } = req.query as Record<string, string>;
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(Math.max(parseInt(limit), 1), 100);
    const query: any = { sellerId: req.user!._id };
    if (status) query.status = status;
    const orders = await OrderModel.find(query).sort({ orderDate: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean();
    const orderIds = orders.map((o) => o._id);
    const orderItems = await OrderItemModel.find({ orderId: { $in: orderIds } }).lean();
    const orderIdToItems: Record<string, any[]> = {};
    for (const item of orderItems) {
        const key = String(item.orderId);
        if (!orderIdToItems[key]) orderIdToItems[key] = [];
        orderIdToItems[key].push(item);
    }
    const items = orders.map((o) => ({ ...o, items: orderIdToItems[String(o._id)] || [] }));
    const total = await OrderModel.countDocuments(query);
    res.json({ items, total, page: pageNum, limit: limitNum });
});

router.post('/:id/confirm', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const order = await OrderModel.findOneAndUpdate({ _id: req.params.id, sellerId: req.user!._id, status: 'pending' }, { status: 'confirmed' }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found or cannot be confirmed' });
    res.json(order);
});

router.get('/:id/shipping-label', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const order = await OrderModel.findOne({ _id: req.params.id, sellerId: req.user!._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const items = await OrderItemModel.find({ orderId: order._id }).lean();
    const label = {
        orderId: order._id,
        sellerId: order.sellerId,
        items: items.map((i) => ({ productId: i.productId, qty: i.quantity })),
        createdAt: new Date().toISOString(),
        barcode: `CODE-${order._id}`
    };
    res.json(label);
});

const StatusSchema = z.object({ status: z.enum(['shipped', 'delivered', 'failed', 'cancelled']) });

router.put('/:id/status', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const parse = StatusSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const order = await OrderModel.findOneAndUpdate({ _id: req.params.id, sellerId: req.user!._id }, { status: parse.data.status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (parse.data.status === 'shipped') {
        await ShippingInfoModel.findOneAndUpdate({ orderId: order._id }, { status: 'shipped' }, { upsert: true });
    }
    res.json(order);
});

export default router; 