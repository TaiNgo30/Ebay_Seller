import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { StoreModel } from '../models/Store.js';

export async function requireSellerVerified(req: AuthRequest, res: Response, next: NextFunction) {
    const user = req.user;
    if (!user || !(user.isSeller || user.role === 'seller')) {
        return res.status(403).json({ message: 'Seller account required' });
    }
    if (user.isSellerVerified) return next();
    const store = await StoreModel.findOne({ sellerId: user._id });
    if (store && store.status === 'approved') return next();
    return res.status(403).json({ message: 'Seller must be verified (store not approved yet)' });
} 