"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Rutas públicas
router.post('/register', auth_controller_1.default.register.bind(auth_controller_1.default));
router.post('/login', auth_controller_1.default.login.bind(auth_controller_1.default));
// Rutas protegidas
router.get('/profile', auth_middleware_1.authenticateToken, auth_controller_1.default.getProfile.bind(auth_controller_1.default));
router.put('/profile', auth_middleware_1.authenticateToken, auth_controller_1.default.updateProfile.bind(auth_controller_1.default));
router.post('/change-password', auth_middleware_1.authenticateToken, auth_controller_1.default.changePassword.bind(auth_controller_1.default));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map