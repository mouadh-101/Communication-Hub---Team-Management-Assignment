import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/users', authMiddleware, userController.listUsersByTenant);

export default router;
