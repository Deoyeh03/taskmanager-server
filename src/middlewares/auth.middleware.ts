import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { UserRepository } from '../repositories/user.repository';

const userRepo = new UserRepository();

interface JwtPayload {
    id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return next(new AppError('Not authorized to access this route', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

        const currentUser = await userRepo.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer does exist', 401));
        }

        // Grant access to protected route
        // @ts-ignore
        req.user = currentUser;
        next();
    } catch (error) {
        return next(new AppError('Not authorized to access this route', 401));
    }
};
