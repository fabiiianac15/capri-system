"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
class AuthService {
    async register(data) {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }
        // Hashear la contraseña
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        // Crear el usuario
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role || 'USER'
            }
        });
        // Generar token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar || undefined,
                phone: user.phone || undefined,
                bio: user.bio || undefined,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt || undefined
            },
            token
        };
    }
    async login(data) {
        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        // Verificar contraseña
        const isValidPassword = await (0, password_1.comparePassword)(data.password, user.password);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }
        // Generar token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar || undefined,
                phone: user.phone || undefined,
                bio: user.bio || undefined,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        };
    }
    async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        // Omitir password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateProfile(userId, data) {
        // Si se actualiza el email, verificar que no exista
        if (data.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email }
            });
            if (existingUser && existingUser.id !== userId) {
                throw new Error('El email ya está en uso');
            }
        }
        const user = await prisma.user.update({
            where: { id: userId },
            data
        });
        // Omitir password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        // Verificar contraseña actual
        const isValidPassword = await (0, password_1.comparePassword)(currentPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Contraseña actual incorrecta');
        }
        // Hashear nueva contraseña
        const hashedPassword = await (0, password_1.hashPassword)(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        return { message: 'Contraseña actualizada exitosamente' };
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map