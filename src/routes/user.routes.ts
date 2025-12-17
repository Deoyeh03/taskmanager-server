import express from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema } from '../validations/user.validation';

const router = express.Router();

router.use(protect);

router.get('/search', userController.searchUsers);
router.get('/', userController.getUsers);
router.patch('/me', validate(updateProfileSchema), userController.updateProfile);

export default router;
