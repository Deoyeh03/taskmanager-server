import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Task from '../models/Task';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/collaborative-task-saas');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Task.deleteMany({});
        console.log('Cleared existing data.');

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Users
        const users = await User.create([
            {
                username: 'alice_manager',
                email: 'alice@example.com',
                passwordHash: hashedPassword,
                bio: 'Project Manager who loves organization.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
            },
            {
                username: 'bob_dev',
                email: 'bob@example.com',
                passwordHash: hashedPassword,
                bio: 'Fullstack developer focused on performance.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
            },
            {
                username: 'charlie_designer',
                email: 'charlie@example.com',
                passwordHash: hashedPassword,
                bio: 'UI/UX Designer with a passion for glassmorphism.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
            }
        ]);

        console.log('Users created.');

        const [alice, bob, charlie] = users;

        // Create Tasks
        const tasks = await Task.create([
            {
                title: 'Implement Authentication Flow',
                description: 'Set up JWT and session management for the application.',
                status: 'Completed',
                priority: 'High',
                category: 'Backend',
                tags: ['Security', 'Auth', 'Critical'],
                creatorId: alice._id,
                assignedToId: bob._id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                comments: [
                    { userId: alice._id, text: 'Keep an eye on security best practices.', createdAt: new Date() },
                    { userId: bob._id, text: 'On it! Adding Zod validation as well.', createdAt: new Date() }
                ],
                activity: [
                    { type: 'created', userId: alice._id, details: 'Task created', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
                    { type: 'assigned', userId: alice._id, details: `Task assigned to ${bob.username}`, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
                ]
            },
            {
                title: 'Design Premium Dashboard UI',
                description: 'Create a glassmorphism design for the main dashboard.',
                status: 'In Progress',
                priority: 'Urgent',
                category: 'Design',
                tags: ['UI', 'UX', 'Framer Motion'],
                creatorId: alice._id,
                assignedToId: charlie._id,
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                activity: [
                    { type: 'created', userId: alice._id, details: 'Task created', createdAt: new Date() }
                ]
            },
            {
                title: 'Optimize Database Queries',
                description: 'Improve MongoDB performance and add necessary indexes.',
                status: 'To Do',
                priority: 'Medium',
                category: 'Backend',
                tags: ['Performance', 'DB'],
                creatorId: bob._id,
                assignedToId: bob._id,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                activity: [
                    { type: 'created', userId: bob._id, details: 'Task created', createdAt: new Date() }
                ]
            }
        ]);

        console.log('Tasks created.');
        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
