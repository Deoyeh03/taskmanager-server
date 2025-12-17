import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models/Task';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional().or(z.date()),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    assignedToId: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional().or(z.date()),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    assignedToId: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
