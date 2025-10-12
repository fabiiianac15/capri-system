import { Router } from 'express';
import staffController from '../controllers/staff.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas específicas primero
router.get('/stats', staffController.getStats.bind(staffController));
router.get('/managers', staffController.getManagers.bind(staffController));

// CRUD básico
router.post('/', staffController.create.bind(staffController));
router.get('/', staffController.getAll.bind(staffController));
router.get('/:id', staffController.getById.bind(staffController));
router.put('/:id', staffController.update.bind(staffController));
router.delete('/:id', staffController.delete.bind(staffController));

export default router;
