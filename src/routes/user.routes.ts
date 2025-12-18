import express from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema } from '../validations/user.validation';
import { uploadAvatar } from '../middlewares/upload.middleware';

const router = express.Router();

router.use(protect);

router.get('/search', userController.searchUsers);
router.get('/', userController.getUsers);
router.patch('/me', validate(updateProfileSchema), userController.updateProfile);

// Avatar routes
router.post('/avatar/upload', uploadAvatar.single('avatar'), userController.uploadAvatarImage);
router.post('/avatar/library', userController.selectLibraryAvatar);
router.get('/avatar/library', userController.getAvatarLibrary);

export default router;
