import { Request, Response } from 'express';
import User from '../models/User';
import { catchAsync } from '../utils/catchAsync';

export const searchUsers = catchAsync(async (req: Request, res: Response) => {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.length < 2) {
        return res.status(200).json({
            status: 'success',
            data: { users: [] }
        });
    }

    const users = await User.find({
        $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ]
    }).select('username email').limit(10);

    res.status(200).json({
        status: 'success',
        data: { users }
    });
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await User.find().select('username email');
    res.status(200).json({
        status: 'success',
        data: { users }
    });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const { avatar, bio } = req.body;
    // @ts-ignore
    const user = await User.findByIdAndUpdate(req.user.id, { avatar, bio }, { new: true, runValidators: true }).select('-passwordHash');

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});
