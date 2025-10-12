import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    phone?: string;
    bio?: string;
    createdAt: Date;
    updatedAt?: Date;
  };
  token: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(data.password);

    // Crear el usuario
    const user: any = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'USER'
      }
    });

    // Generar token
    const token = generateToken({
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

  async login(data: LoginData): Promise<AuthResponse> {
    // Buscar usuario
    const user: any = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = generateToken({
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

  async getProfile(userId: string) {
    const user: any = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Omitir password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: {
    name?: string;
    email?: string;
    avatar?: string;
    phone?: string;
    bio?: string;
  }) {
    // Si se actualiza el email, verificar que no exista
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error('El email ya está en uso');
      }
    }

    const user: any = await prisma.user.update({
      where: { id: userId },
      data
    });

    // Omitir password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isValidPassword = await comparePassword(currentPassword, user.password);

    if (!isValidPassword) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Hashear nueva contraseña
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }
}

export default new AuthService();
