import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireSellerVerified } from '../middleware/requireSellerVerified.js';
import { env } from '../config/env.js';
import { ProductModel } from '../models/Product.js';
import { InventoryModel } from '../models/Inventory.js';
import { productCreateLimiter } from '../middleware/rateLimit.js';
import { verifyRecaptcha } from '../middleware/recaptcha.js';

const router = Router();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), env.uploadsDir)),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const AttributeValueSchema = z.union([z.string(), z.number(), z.boolean()]);

const ProductCreateSchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    categoryId: z.string().optional(),
    isAuction: z.coerce.boolean().optional(),
    auctionEndTime: z.coerce.date().optional(),
    attributes: z
        .union([
            z.record(z.string(), AttributeValueSchema),
            z
                .string()
                .transform((v) => JSON.parse(v))
                .pipe(z.record(z.string(), AttributeValueSchema))
        ])
        .optional(),
    quantity: z.coerce.number().int().min(0).default(0)
});

router.post('/', authMiddleware, requireSellerVerified, productCreateLimiter, verifyRecaptcha, upload.array('images', 8), async (req: AuthRequest, res) => {
    const parse = ProductCreateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const { title, description, price, categoryId, isAuction, auctionEndTime, attributes, quantity } = parse.data as any;

    // Enforce listing limits
    const user = req.user!;
    const activeCount = await ProductModel.countDocuments({ sellerId: user._id, status: 'active' });
    if (activeCount >= user.sellerLimits.maxActiveListings) {
        return res.status(403).json({ message: 'Active listings limit reached for your rank' });
    }

    const images = (req.files as Express.Multer.File[] | undefined)?.map((f) => `/uploads/${f.filename}`) || [];
    const product = await ProductModel.create({
        title,
        description,
        price,
        images,
        categoryId,
        sellerId: user._id,
        isAuction: !!isAuction,
        auctionEndTime,
        attributes: attributes || {}
    });
    await InventoryModel.create({ productId: product._id, quantity });
    res.status(201).json(product);
});

const ProductUpdateSchema = z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    categoryId: z.string().optional(),
    isAuction: z.coerce.boolean().optional(),
    auctionEndTime: z.coerce.date().optional(),
    attributes: z
        .union([
            z.record(z.string(), AttributeValueSchema),
            z
                .string()
                .transform((v) => JSON.parse(v))
                .pipe(z.record(z.string(), AttributeValueSchema))
        ])
        .optional()
});

router.put('/:id', authMiddleware, requireSellerVerified, upload.array('images', 8), async (req: AuthRequest, res) => {
    const parse = ProductUpdateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const updates: any = parse.data;
    const images = (req.files as Express.Multer.File[] | undefined)?.map((f) => `/uploads/${f.filename}`) || [];
    if (images.length) updates.$push = { images: { $each: images } };
    const product = await ProductModel.findOneAndUpdate({ _id: req.params.id, sellerId: req.user!._id }, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

router.get('/', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const { page = '1', limit = '20', status } = req.query as Record<string, string>;
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(Math.max(parseInt(limit), 1), 100);
    const query: any = { sellerId: req.user!._id };
    if (status) query.status = status;
    const [items, total] = await Promise.all([
        ProductModel.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
        ProductModel.countDocuments(query)
    ]);
    res.json({ items, total, page: pageNum, limit: limitNum });
});

router.put('/:id/hide', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const product = await ProductModel.findOneAndUpdate({ _id: req.params.id, sellerId: req.user!._id }, { status: 'hidden' }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

router.put('/:id/unhide', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const product = await ProductModel.findOneAndUpdate({ _id: req.params.id, sellerId: req.user!._id }, { status: 'active' }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

router.delete('/:id', authMiddleware, requireSellerVerified, async (req: AuthRequest, res) => {
    const product = await ProductModel.findOneAndUpdate({ _id: req.params.id, sellerId: req.user!._id }, { status: 'deleted' }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ ok: true });
});

export default router; 