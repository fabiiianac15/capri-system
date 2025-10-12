import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// CRUD de productos
router.get('/', productController.getAll);
router.get('/stats', productController.getStats);
router.get('/low-stock', productController.getLowStock);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

// Salidas de inventario
router.post('/outputs', productController.createOutput);
router.get('/:productId/outputs', productController.getOutputs);

export default router;
