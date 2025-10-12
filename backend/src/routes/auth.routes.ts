import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Rutas protegidas
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));
router.put('/profile', authenticateToken, authController.updateProfile.bind(authController));
router.post('/change-password', authenticateToken, authController.changePassword.bind(authController));

export default router;
