import express, { Express } from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initSocket } from './sockets/socket.instance';
import { setupSocketEvents } from './sockets/socket.events';
import { globalErrorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Initialize Socket.io Singleton and Events
const io = initSocket(httpServer);
setupSocketEvents(io);

app.use(limiter);
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Global Error Handler
app.use(globalErrorHandler);

const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/collaborative-task-saas';

if (!process.env.MONGO_URI) {
    console.warn('WARNING: MONGO_URI environment variable is not set. Falling back to local MongoDB.');
} else {
    console.log('Using MONGO_URI from environment variables.');
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
