import { Request, Response } from 'express';
import authService from '../services/auth.service';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
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

      const result = await authService.register({ email, password, name, role });
      
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al registrar usuario' });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email y contraseña son requeridos' });
        return;
      }

      const result = await authService.login({ email, password });
      
      res.status(200).json({
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al iniciar sesión' });
      }
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const profile = await authService.getProfile(req.user.userId);
      
      res.status(200).json({
        data: profile
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al obtener perfil' });
      }
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { name, email, avatar, phone, bio } = req.body;

      const profile = await authService.updateProfile(req.user.userId, {
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
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al actualizar perfil' });
      }
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
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

      const result = await authService.changePassword(req.user.userId, currentPassword, newPassword);
      
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al cambiar contraseña' });
      }
    }
  }
}

export default new AuthController();
