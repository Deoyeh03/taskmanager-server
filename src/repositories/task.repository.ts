import Task, { ITask } from '../models/Task';

export class TaskRepository {
    async create(data: Partial<ITask>): Promise<ITask> {
        return Task.create(data);
    }

    async findAll(filter: any = {}): Promise<ITask[]> {
        return Task.find(filter)
            .populate('assignedToId', 'username email avatar')
            .populate('creatorId', 'username email avatar')
            .populate('comments.userId', 'username email avatar')
            .populate('activity.userId', 'username email avatar')
            .sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<ITask | null> {
        return Task.findById(id)
            .populate('assignedToId', 'username email avatar')
            .populate('creatorId', 'username email avatar')
            .populate('comments.userId', 'username email avatar')
            .populate('activity.userId', 'username email avatar');
    }

    async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
        return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .populate('assignedToId', 'username email avatar')
            .populate('creatorId', 'username email avatar')
            .populate('comments.userId', 'username email avatar')
            .populate('activity.userId', 'username email avatar');
    }

    async delete(id: string): Promise<ITask | null> {
        return Task.findByIdAndDelete(id);
    }
}
