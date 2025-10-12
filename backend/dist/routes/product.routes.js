"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// CRUD de productos
router.get('/', product_controller_1.productController.getAll);
router.get('/stats', product_controller_1.productController.getStats);
router.get('/low-stock', product_controller_1.productController.getLowStock);
router.get('/:id', product_controller_1.productController.getById);
router.post('/', product_controller_1.productController.create);
router.put('/:id', product_controller_1.productController.update);
router.delete('/:id', product_controller_1.productController.delete);
// Salidas de inventario
router.post('/outputs', product_controller_1.productController.createOutput);
router.get('/:productId/outputs', product_controller_1.productController.getOutputs);
exports.default = router;
//# sourceMappingURL=product.routes.js.map