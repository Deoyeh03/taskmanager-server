import { z } from 'zod';

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(100),
        description: z.string().max(500).optional(),
        priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
        importance: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
        dueDate: z.string().datetime().optional(),
        assignedToId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
    }),
});

export const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']).optional(),
        priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
        importance: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
        dueDate: z.string().datetime().optional(),
        assignedToId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
    }),
});
