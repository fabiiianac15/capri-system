import { Request, Response } from 'express';
import goatService from '../services/goat.service';

class GoatController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Validaciones básicas
      if (!data.customId || !data.breed || !data.sex || !data.birthDate) {
        res.status(400).json({ 
          error: 'Faltan campos requeridos: customId, breed, sex, birthDate' 
        });
        return;
      }

      // Convertir birthDate a Date
      data.birthDate = new Date(data.birthDate);

      const goat = await goatService.create(data);
      
      res.status(201).json({
        message: 'Cabra registrada exitosamente',
        data: goat
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al registrar cabra' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { category, breed, status, sex } = req.query;

      const goats = await goatService.getAll({
        category: category as string,
        breed: breed as string,
        status: status as string,
        sex: sex as string
      });
      
      res.status(200).json({
        data: goats,
        count: goats.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener cabras' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const goat = await goatService.getById(id);
      
      res.status(200).json({ data: goat });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al obtener cabra' });
      }
    }
  }

  async getByCustomId(req: Request, res: Response): Promise<void> {
    try {
      const { customId } = req.params;
      const goat = await goatService.getByCustomId(customId);
      
      res.status(200).json({ data: goat });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al obtener cabra' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const goat = await goatService.update(id, data);
      
      res.status(200).json({
        message: 'Cabra actualizada exitosamente',
        data: goat
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al actualizar cabra' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const goat = await goatService.delete(id);
      
      res.status(200).json({
        message: 'Cabra eliminada exitosamente',
        data: goat
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al eliminar cabra' });
      }
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await goatService.getStats();
      
      res.status(200).json({ data: stats });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }

  async updateCategoryByWeight(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const goat = await goatService.updateCategoryByWeight(id);
      
      res.status(200).json({
        message: 'Categoría actualizada según peso',
        data: goat
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al actualizar categoría' });
      }
    }
  }
}

export default new GoatController();
