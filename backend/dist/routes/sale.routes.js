"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sale_controller_1 = __importDefault(require("../controllers/sale.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// Rutas específicas primero
router.get('/stats', sale_controller_1.default.getStats.bind(sale_controller_1.default));
// CRUD básico
router.post('/', sale_controller_1.default.create.bind(sale_controller_1.default));
router.get('/', sale_controller_1.default.getAll.bind(sale_controller_1.default));
router.get('/:id', sale_controller_1.default.getById.bind(sale_controller_1.default));
router.put('/:id', sale_controller_1.default.update.bind(sale_controller_1.default));
router.delete('/:id', sale_controller_1.default.delete.bind(sale_controller_1.default));
exports.default = router;
//# sourceMappingURL=sale.routes.js.map