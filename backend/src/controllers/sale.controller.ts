import { Request, Response } from 'express';
import saleService from '../services/sale.service';

class SaleController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      // Validaciones básicas
      if (!data.productType || !data.customerName || !data.quantity || !data.unitPrice || !data.paymentMethod) {
        res.status(400).json({ 
          error: 'Faltan campos requeridos: productType, customerName, quantity, unitPrice, paymentMethod' 
        });
        return;
      }

      // Calcular totalPrice si no se proporciona
      if (!data.totalPrice) {
        data.totalPrice = data.quantity * data.unitPrice;
      }

      const sale = await saleService.create({
        ...data,
        userId
      });
      
      res.status(201).json({
        message: 'Venta registrada exitosamente',
        data: sale
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al registrar venta' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { productType, paymentStatus, startDate, endDate } = req.query;

      const sales = await saleService.getAll({
        productType: productType as string,
        paymentStatus: paymentStatus as string,
        startDate: startDate as string,
        endDate: endDate as string
      });
      
      res.status(200).json({
        data: sales,
        count: sales.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ventas' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sale = await saleService.getById(id);
      
      res.status(200).json({ data: sale });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al obtener venta' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const sale = await saleService.update(id, data);
      
      res.status(200).json({
        message: 'Venta actualizada exitosamente',
        data: sale
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al actualizar venta' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sale = await saleService.delete(id);
      
      res.status(200).json({
        message: 'Venta eliminada exitosamente',
        data: sale
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al eliminar venta' });
      }
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await saleService.getStats();
      
      res.status(200).json({ data: stats });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }
}

export default new SaleController();
