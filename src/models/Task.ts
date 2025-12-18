import mongoose, { Schema, Document } from 'mongoose';

export enum TaskPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Urgent = 'Urgent',
}

export enum TaskStatus {
    ToDo = 'To Do',
    InProgress = 'In Progress',
    Review = 'Review',
    Completed = 'Completed',
}

export interface ITask extends Document {
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
    creatorId: mongoose.Types.ObjectId;
    assignedToId?: mongoose.Types.ObjectId;
    tags: string[];
    category?: string;
    comments: {
        userId: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
    }[];
    activity: {
        type: string;
        userId: mongoose.Types.ObjectId;
        details: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true, maxlength: 100, trim: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: false },
    priority: {
        type: String,
        enum: Object.values(TaskPriority),
        default: TaskPriority.Medium
    },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.ToDo
    },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedToId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    tags: [{ type: String }],
    category: { type: String },
    comments: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }],
    activity: [{
        type: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        details: { type: String },
        createdAt: { type: Date, default: Date.now },
    }],
    expiresAt: { type: Date }, // For dummy data expiry
}, {
    timestamps: true
});

// TTL Index
TaskSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ITask>('Task', TaskSchema);
