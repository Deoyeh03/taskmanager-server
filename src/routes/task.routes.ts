import express from 'express';
import * as taskController from '../controllers/task.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(taskController.findAll)
    .post(validate(createTaskSchema), taskController.create);

router.route('/:id')
    .patch(validate(updateTaskSchema), taskController.update)
    .delete(taskController._delete);

router.post('/:id/comments', taskController.addComment);

export default router;
