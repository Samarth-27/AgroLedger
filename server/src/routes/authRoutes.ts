import { Router } from 'express';
import { authController } from '@controllers/AuthController';

const router = Router();

router.post('/login', authController.login.bind(authController));

export { router as authRoutes };
