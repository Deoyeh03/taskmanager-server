import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { catchAsync } from '../utils/catchAsync';
import { createTaskSchema, updateTaskSchema } from '../dtos/task.dto';

const taskService = new TaskService();

export const create = catchAsync(async (req: Request, res: Response) => {
    const input = createTaskSchema.parse(req.body);
    // @ts-ignore
    const task = await taskService.create(req.user.id, input);

    res.status(201).json({
        status: 'success',
        data: { task },
    });
});

export const findAll = catchAsync(async (req: Request, res: Response) => {
    // Support filtering by assignedToId
    const filter: any = {};
    if (req.query.assignedToId) {
        filter.assignedToId = req.query.assignedToId;
    }
    const tasks = await taskService.findAll(filter);
    res.status(200).json({
        status: 'success',
        data: { tasks },
    });
});

export const update = catchAsync(async (req: Request, res: Response) => {
    const input = updateTaskSchema.parse(req.body);
    // @ts-ignore
    const task = await taskService.update(req.params.id, req.user.id, input);
    res.status(200).json({
        status: 'success',
        data: { task },
    });
});

export const _delete = catchAsync(async (req: Request, res: Response) => {
    await taskService.delete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const addComment = catchAsync(async (req: Request, res: Response) => {
    const { text } = req.body;
    // @ts-ignore
    const task = await taskService.addComment(req.params.id, req.user.id, text);
    res.status(201).json({
        status: 'success',
        data: { task },
    });
});
