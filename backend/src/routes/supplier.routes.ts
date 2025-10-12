import { Router } from 'express';
import { supplierController } from '../controllers/supplier.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// CRUD de proveedores
router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);
router.post('/', supplierController.create);
router.put('/:id', supplierController.update);
router.delete('/:id', supplierController.delete);

// Rutas para cascada de ubicación
router.get('/locations/countries', supplierController.getCountries);
router.get('/locations/states/:countryId', supplierController.getStates);
router.get('/locations/cities/:stateId', supplierController.getCities);

export default router;
