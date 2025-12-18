import { Request, Response } from 'express';
import User from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { avatarLibrary, getAvatarById } from '../constants/avatarLibrary';
import { AppError } from '../utils/AppError';

export const searchUsers = catchAsync(async (req: Request, res: Response) => {
    const { query } = req.query;
    // @ts-ignore
    console.log(`[Search] Query: "${query}" for user: ${req.user ? (req.user as any).username : 'No user'}`);

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
    }).select('_id username email').limit(10);

    console.log(`[Search] Found ${users.length} users`);

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

// Upload custom avatar image
export const uploadAvatarImage = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new AppError('No file uploaded', 400);
    }

    // Construct the avatar URL path
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // @ts-ignore
    const user = await User.findByIdAndUpdate(
        // @ts-ignore
        req.user.id,
        { avatar: avatarPath, avatarType: 'upload' },
        { new: true, runValidators: true }
    ).select('-passwordHash');

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

// Select avatar from library
export const selectLibraryAvatar = catchAsync(async (req: Request, res: Response) => {
    const { avatarId } = req.body;

    if (!avatarId) {
        throw new AppError('Avatar ID is required', 400);
    }

    const selectedAvatar = getAvatarById(avatarId);
    if (!selectedAvatar) {
        throw new AppError('Invalid avatar ID', 400);
    }

    // @ts-ignore
    const user = await User.findByIdAndUpdate(
        // @ts-ignore
        req.user.id,
        { avatar: selectedAvatar.url, avatarType: 'library' },
        { new: true, runValidators: true }
    ).select('-passwordHash');

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

// Get avatar library
export const getAvatarLibrary = catchAsync(async (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        data: { avatars: avatarLibrary }
    });
});
