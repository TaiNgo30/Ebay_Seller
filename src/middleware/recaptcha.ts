import { Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { AuthRequest } from './auth.js';

export async function verifyRecaptcha(req: AuthRequest, res: Response, next: NextFunction) {
    if (!env.enableRecaptcha) return next();

    const token = (req.body && (req.body.recaptchaToken || req.body.recaptcha)) || req.headers['x-recaptcha-token'];
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: 'Missing recaptcha token' });
    }

    try {
        const params = new URLSearchParams();
        params.set('secret', env.recaptchaSecret);
        params.set('response', token);
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            body: params
        });
        const data = (await response.json()) as { success: boolean; score?: number };
        if (!data.success) {
            return res.status(400).json({ message: 'Recaptcha verification failed' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Recaptcha verification error' });
    }
} 