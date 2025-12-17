import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export const globalErrorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let status = 'error';
    let message = err.message;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        status = err.status;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        status = 'fail';
        message = err.errors.map(e => e.message).join(', ');
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        status = 'fail';
        message = 'Invalid token. Please log in again.';
    }

    // Development detailed error
    if (process.env.NODE_ENV !== 'production') {
        console.error('ERROR 💥', err);
    }

    res.status(statusCode).json({
        status,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};
