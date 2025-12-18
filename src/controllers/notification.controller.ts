import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

export const getNotifications = async (req: any, res: Response, next: NextFunction) => {
    try {
        const notifications = await NotificationService.getForUser(req.user.id);
        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        next(err);
    }
};

export const markAsRead = async (req: any, res: Response, next: NextFunction) => {
    try {
        await NotificationService.markAsRead(req.params.id, req.user.id);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
};

export const markAllAsRead = async (req: any, res: Response, next: NextFunction) => {
    try {
        await NotificationService.markAllAsRead(req.user.id);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
};
