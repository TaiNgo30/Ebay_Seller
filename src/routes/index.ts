import { Router } from 'express';
import authRoutes from './auth.routes.js';
import sellerRoutes from './seller.routes.js';
import productRoutes from './product.routes.js';
import inventoryRoutes from './inventory.routes.js';
import couponRoutes from './coupon.routes.js';
import orderRoutes from './order.routes.js';
import reviewRoutes from './review.routes.js';
import feedbackRoutes from './feedback.routes.js';
import reportRoutes from './report.routes.js';
import disputeRoutes from './dispute.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/seller', sellerRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/coupons', couponRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/reports', reportRoutes);
router.use('/disputes', disputeRoutes);

export default router; 