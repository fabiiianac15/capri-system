"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplier_controller_1 = require("../controllers/supplier.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// CRUD de proveedores
router.get('/', supplier_controller_1.supplierController.getAll);
router.get('/:id', supplier_controller_1.supplierController.getById);
router.post('/', supplier_controller_1.supplierController.create);
router.put('/:id', supplier_controller_1.supplierController.update);
router.delete('/:id', supplier_controller_1.supplierController.delete);
// Rutas para cascada de ubicación
router.get('/locations/countries', supplier_controller_1.supplierController.getCountries);
router.get('/locations/states/:countryId', supplier_controller_1.supplierController.getStates);
router.get('/locations/cities/:stateId', supplier_controller_1.supplierController.getCities);
exports.default = router;
//# sourceMappingURL=supplier.routes.js.map