import Notification from '../models/Notification';
import { getIO } from '../sockets/socket.instance';

export class NotificationService {
    static async create(userId: string, text: string, type: string, relatedId?: string) {
        const notification = await Notification.create({
            userId,
            text,
            type,
            relatedId
        });

        // Real-time emit to specific user
        getIO().to(userId).emit('notification:new', notification);

        return notification;
    }

    static async getForUser(userId: string) {
        return Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
    }

    static async markAsRead(id: string, userId: string) {
        return Notification.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true },
            { new: true }
        );
    }

    static async markAllAsRead(userId: string) {
        return Notification.updateMany({ userId, isRead: false }, { isRead: true });
    }
}
