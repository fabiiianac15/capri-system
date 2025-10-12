import { Router } from 'express';
import saleController from '../controllers/sale.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas específicas primero
router.get('/stats', saleController.getStats.bind(saleController));

// CRUD básico
router.post('/', saleController.create.bind(saleController));
router.get('/', saleController.getAll.bind(saleController));
router.get('/:id', saleController.getById.bind(saleController));
router.put('/:id', saleController.update.bind(saleController));
router.delete('/:id', saleController.delete.bind(saleController));

export default router;
