import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
        bio: z.string().max(200, 'Bio must be at most 200 characters').optional().or(z.literal('')),
    }),
});
