"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    async register(req, res) {
        try {
            const { email, password, name, role } = req.body;
            // Validaciones básicas
            if (!email || !password || !name) {
                res.status(400).json({ error: 'Faltan campos requeridos' });
                return;
            }
            if (password.length < 6) {
                res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
                return;
            }
            const result = await auth_service_1.default.register({ email, password, name, role });
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                data: result
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al registrar usuario' });
            }
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: 'Email y contraseña son requeridos' });
                return;
            }
            const result = await auth_service_1.default.login({ email, password });
            res.status(200).json({
                message: 'Login exitoso',
                data: result
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al iniciar sesión' });
            }
        }
    }
    async getProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'No autenticado' });
                return;
            }
            const profile = await auth_service_1.default.getProfile(req.user.userId);
            res.status(200).json({
                data: profile
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al obtener perfil' });
            }
        }
    }
    async updateProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'No autenticado' });
                return;
            }
            const { name, email, avatar, phone, bio } = req.body;
            const profile = await auth_service_1.default.updateProfile(req.user.userId, {
                name,
                email,
                avatar,
                phone,
                bio
            });
            res.status(200).json({
                message: 'Perfil actualizado exitosamente',
                data: profile
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al actualizar perfil' });
            }
        }
    }
    async changePassword(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'No autenticado' });
                return;
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
                return;
            }
            if (newPassword.length < 6) {
                res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
                return;
            }
            const result = await auth_service_1.default.changePassword(req.user.userId, currentPassword, newPassword);
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al cambiar contraseña' });
            }
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map