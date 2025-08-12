import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { UserModel } from '../models/User.js';
import { signJwt } from '../middleware/auth.js';

const router = Router();

const RegisterSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    isSeller: z.boolean().optional()
});

router.post('/register', async (req, res) => {
    const parse = RegisterSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const { username, email, password, isSeller } = parse.data;
    const existing = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(409).json({ message: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, email, password: hash, isSeller: !!isSeller });
    const token = signJwt({ userId: user._id });
    res.json({ token });
});

const LoginSchema = z.object({ usernameOrEmail: z.string(), password: z.string() });

router.post('/login', async (req, res) => {
    const parse = LoginSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: parse.error.message });
    const { usernameOrEmail, password } = parse.data;
    const user = await UserModel.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signJwt({ userId: user._id });
    res.json({ token });
});

export default router; 