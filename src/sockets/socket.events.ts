import { Server, Socket } from 'socket.io';

export const setupSocketEvents = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        // Join user to their own room for private notifications
        const userId = socket.handshake.query.userId;
        if (userId) {
            socket.join(userId as string);
            console.log(`User ${userId} joined their room`);
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
