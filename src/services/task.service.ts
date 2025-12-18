import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskInput, UpdateTaskInput } from '../dtos/task.dto';
import { AppError } from '../utils/AppError';
import { getIO } from '../sockets/socket.instance';
import { NotificationService } from './notification.service';

export class TaskService {
    private taskRepo: TaskRepository;

    constructor() {
        this.taskRepo = new TaskRepository();
    }

    async create(userId: string, input: CreateTaskInput) {
        if (input.assignedToId === userId) {
            throw new AppError('You cannot assign a task to yourself', 400);
        }
        const task = await this.taskRepo.create({
            ...input,
            dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
            creatorId: userId as any,
            activity: [{
                type: 'created',
                userId: userId as any,
                details: 'Task created',
                createdAt: new Date()
            }]
        } as any);

        // Populate for the frontend
        const populatedTask = await this.taskRepo.findById(task.id);
        if (!populatedTask) {
            throw new AppError('Task could not be found after creation', 500);
        }

        // Real-time notification
        getIO().emit('task:created', populatedTask);

        if (input.assignedToId) {
            getIO().to(input.assignedToId).emit('task:assigned', populatedTask);
            await NotificationService.create(
                input.assignedToId,
                `New task assigned: "${populatedTask.title}"`,
                'task_assigned',
                populatedTask.id
            );
        }

        return populatedTask;
    }

    async findAll(filter: any) {
        return this.taskRepo.findAll(filter);
    }

    async update(id: string, userId: string, input: UpdateTaskInput) {
        const task = await this.taskRepo.findById(id);
        if (!task) {
            throw new AppError('Task not found', 404);
        }

        // Basic permission check
        const isCreator = task.creatorId?._id?.toString() === userId || task.creatorId?.toString() === userId;
        const isAssigned = task.assignedToId?._id?.toString() === userId || task.assignedToId?.toString() === userId;

        if (!isCreator && !isAssigned) {
            throw new AppError('You do not have permission to update this task', 403);
        }

        if (input.assignedToId === userId && !isCreator) {
            throw new AppError('You cannot assign a task to yourself', 400);
        }

        const updateData: any = { ...input };
        if (input.dueDate) {
            updateData.dueDate = new Date(input.dueDate);
        }

        const activity = {
            userId: userId as any,
            type: 'updated',
            details: 'Task updated',
            createdAt: new Date()
        };

        if (input.status && input.status !== task!.status) {
            activity.type = 'status_change';
            activity.details = `Moved task to ${input.status}`;
        } else if (input.assignedToId && input.assignedToId !== task!.assignedToId?.toString()) {
            activity.type = 'assigned';
            activity.details = `Task assigned to ${input.assignedToId}`;
        }

        const updatedTask = await this.taskRepo.update(id, {
            ...updateData,
            $push: { activity }
        } as any);

        getIO().emit('task:updated', updatedTask);

        if (input.assignedToId && input.assignedToId !== task!.assignedToId?.toString()) {
            getIO().to(input.assignedToId).emit('task:assigned', updatedTask);
            await NotificationService.create(
                input.assignedToId,
                `Task assigned to you: "${updatedTask!.title}"`,
                'task_assigned',
                updatedTask!.id
            );
        } else if (input.status && input.status !== task!.status) {
            // Notify creator and assigned user of status change
            const usersToNotify = new Set([task!.creatorId?.toString(), task!.assignedToId?.toString()]);
            usersToNotify.delete(userId); // Don't notify the person who made the change

            for (const targetId of usersToNotify) {
                if (targetId) {
                    await NotificationService.create(
                        targetId,
                        `Task "${updatedTask!.title}" moved to ${input!.status}`,
                        'status_change',
                        updatedTask!.id
                    );
                }
            }
        }

        return updatedTask;
    }

    async delete(id: string) {
        const task = await this.taskRepo.findById(id);
        if (!task) {
            throw new AppError('Task not found', 404);
        }
        await this.taskRepo.delete(id);
        getIO().emit('task:deleted', id);
        return;
    }

    async addComment(taskId: string, userId: string, text: string) {
        const activity = {
            type: 'commented',
            userId: userId as any,
            details: `Added a comment: ${text.substring(0, 30)}...`,
            createdAt: new Date()
        };

        const task = await this.taskRepo.update(taskId, {
            $push: {
                comments: { userId: userId as any, text, createdAt: new Date() },
                activity
            }
        } as any);

        getIO().emit('task:updated', task);
        return task;
    }
}
