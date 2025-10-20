import { Request, Response } from 'express';
import staffService from '../services/staff.service';

class StaffController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Validaciones básicas (salary es opcional para practicantes)
      if (!data.fullName || !data.dni || !data.staffType || data.yearsExperience === undefined || !data.startDate) {
        res.status(400).json({ 
          error: 'Faltan campos requeridos: fullName, dni, staffType, yearsExperience, startDate' 
        });
        return;
      }

      // Convertir fechas
      data.startDate = new Date(data.startDate);
      if (data.endDate) {
        data.endDate = new Date(data.endDate);
      }

      const staff = await staffService.create(data);
      
      res.status(201).json({
        message: 'Empleado registrado exitosamente',
        data: staff
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al registrar empleado' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { staffType } = req.query;

      const staff = await staffService.getAll({
        staffType: staffType as string
      });
      
      res.status(200).json({
        data: staff,
        count: staff.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener empleados' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const staff = await staffService.getById(id);
      
      res.status(200).json({ data: staff });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al obtener empleado' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      // Convertir fechas si existen
      if (data.startDate) {
        data.startDate = new Date(data.startDate);
      }
      if (data.endDate) {
        data.endDate = new Date(data.endDate);
      }

      const staff = await staffService.update(id, data);
      
      res.status(200).json({
        message: 'Empleado actualizado exitosamente',
        data: staff
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al actualizar empleado' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const staff = await staffService.delete(id);
      
      res.status(200).json({
        message: 'Empleado eliminado exitosamente',
        data: staff
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al eliminar empleado' });
      }
    }
  }

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await staffService.getStats();
      
      res.status(200).json({ data: stats });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }

  async getManagers(_req: Request, res: Response): Promise<void> {
    try {
      const managers = await staffService.getManagers();
      
      res.status(200).json({ data: managers });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener gerentes' });
    }
  }
}

export default new StaffController();
