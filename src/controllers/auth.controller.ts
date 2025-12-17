import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';
import { registerSchema, loginSchema } from '../dtos/auth.dto';

const authService = new AuthService();

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const input = registerSchema.parse(req.body);
    const { user, token } = await authService.register(input);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        },
    });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const input = loginSchema.parse(req.body);
    const { user, token } = await authService.login(input);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        },
    });
});

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({ status: 'success' });
};

export const getMe = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore - Check if user is attached by middleware
    const user = req.user;
    res.status(200).json({
        status: 'success',
        data: { user },
    });
});
