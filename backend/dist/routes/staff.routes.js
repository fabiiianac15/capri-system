"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staff_controller_1 = __importDefault(require("../controllers/staff.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// Rutas específicas primero
router.get('/stats', staff_controller_1.default.getStats.bind(staff_controller_1.default));
router.get('/managers', staff_controller_1.default.getManagers.bind(staff_controller_1.default));
// CRUD básico
router.post('/', staff_controller_1.default.create.bind(staff_controller_1.default));
router.get('/', staff_controller_1.default.getAll.bind(staff_controller_1.default));
router.get('/:id', staff_controller_1.default.getById.bind(staff_controller_1.default));
router.put('/:id', staff_controller_1.default.update.bind(staff_controller_1.default));
router.delete('/:id', staff_controller_1.default.delete.bind(staff_controller_1.default));
exports.default = router;
//# sourceMappingURL=staff.routes.js.map