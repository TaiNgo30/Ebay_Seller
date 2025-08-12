import { Request, Response, NextFunction } from 'express';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UserModel, UserDocument } from '../models/User.js';

export interface AuthRequest extends Request {
    user?: UserDocument;
}

export function signJwt(payload: object, expiresIn: string | number = '7d'): string {
    return jwt.sign(payload as any, env.jwtSecret as Secret, { expiresIn } as SignOptions);
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring('Bearer '.length)
        : undefined;
    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }
    try {
        const decoded = jwt.verify(token, env.jwtSecret as Secret) as { userId: string };
        const user = await UserModel.findById(decoded.userId);
        if (!user) return res.status(401).json({ message: 'Invalid token' });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
} 