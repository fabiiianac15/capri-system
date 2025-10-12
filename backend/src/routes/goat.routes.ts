import { Router } from 'express';
import goatController from '../controllers/goat.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas específicas PRIMERO (antes de las rutas con parámetros)
router.get('/stats', goatController.getStats.bind(goatController));

// CRUD básico
router.post('/', goatController.create.bind(goatController));
router.get('/', goatController.getAll.bind(goatController));
router.get('/:id', goatController.getById.bind(goatController));
router.get('/custom/:customId', goatController.getByCustomId.bind(goatController));
router.put('/:id', goatController.update.bind(goatController));
router.delete('/:id', goatController.delete.bind(goatController));

// Actualización automática de categoría
router.patch('/:id/update-category', goatController.updateCategoryByWeight.bind(goatController));

export default router;
