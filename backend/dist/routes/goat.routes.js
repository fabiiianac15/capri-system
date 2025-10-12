"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const goat_controller_1 = __importDefault(require("../controllers/goat.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// Rutas específicas PRIMERO (antes de las rutas con parámetros)
router.get('/stats', goat_controller_1.default.getStats.bind(goat_controller_1.default));
// CRUD básico
router.post('/', goat_controller_1.default.create.bind(goat_controller_1.default));
router.get('/', goat_controller_1.default.getAll.bind(goat_controller_1.default));
router.get('/:id', goat_controller_1.default.getById.bind(goat_controller_1.default));
router.get('/custom/:customId', goat_controller_1.default.getByCustomId.bind(goat_controller_1.default));
router.put('/:id', goat_controller_1.default.update.bind(goat_controller_1.default));
router.delete('/:id', goat_controller_1.default.delete.bind(goat_controller_1.default));
// Actualización automática de categoría
router.patch('/:id/update-category', goat_controller_1.default.updateCategoryByWeight.bind(goat_controller_1.default));
exports.default = router;
//# sourceMappingURL=goat.routes.js.map