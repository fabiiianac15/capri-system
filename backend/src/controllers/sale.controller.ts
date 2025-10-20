import { Request, Response } from 'express';
import saleService from '../services/sale.service';

class SaleController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const userId = (req as any).user?.userId;

      console.log('🔍 Datos recibidos para crear venta:', JSON.stringify(data, null, 2));
      console.log('👤 UserId del token:', userId);

      if (!userId) {
        console.error('❌ Usuario no autenticado - userId no encontrado en token');
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      // Validaciones básicas
      if (!data.productType || !data.customerName || !data.quantity || !data.unitPrice || !data.paymentMethod) {
        console.error('❌ Faltan campos requeridos:', {
          productType: !!data.productType,
          customerName: !!data.customerName,
          quantity: !!data.quantity,
          unitPrice: !!data.unitPrice,
          paymentMethod: !!data.paymentMethod
        });
        res.status(400).json({ 
          error: 'Faltan campos requeridos: productType, customerName, quantity, unitPrice, paymentMethod' 
        });
        return;
      }

      // Validar que unit no esté vacío
      if (!data.unit || data.unit.trim() === '') {
        console.error('❌ Unit está vacío o no proporcionado');
        res.status(400).json({ 
          error: 'El campo "unit" (unidad de medida) es requerido' 
        });
        return;
      }

      // Calcular totalPrice si no se proporciona
      if (!data.totalPrice) {
        data.totalPrice = data.quantity * data.unitPrice;
      }

      // Convertir saleDate a formato DateTime ISO-8601 si viene solo como fecha
      let saleDate = data.saleDate;
      if (saleDate && typeof saleDate === 'string') {
        // Si es solo una fecha (YYYY-MM-DD), agregar hora
        if (saleDate.length === 10 && saleDate.includes('-')) {
          saleDate = new Date(saleDate + 'T00:00:00.000Z');
          console.log('� Fecha convertida de', data.saleDate, 'a', saleDate.toISOString());
        } else {
          saleDate = new Date(saleDate);
        }
      }

      console.log('�📝 Creando venta con userId:', userId);
      const sale = await saleService.create({
        ...data,
        saleDate,
        userId
      });
      
      console.log('✅ Venta creada exitosamente:', sale.id);
      res.status(201).json({
        message: 'Venta registrada exitosamente',
        data: sale
      });
    } catch (error) {
      console.error('❌ Error al crear venta:', error);
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

      console.log('🔍 Datos recibidos para actualizar venta:', JSON.stringify(data, null, 2));

      // Convertir saleDate a formato DateTime ISO-8601 si viene solo como fecha
      if (data.saleDate && typeof data.saleDate === 'string') {
        // Si es solo una fecha (YYYY-MM-DD), agregar hora
        if (data.saleDate.length === 10 && data.saleDate.includes('-')) {
          data.saleDate = new Date(data.saleDate + 'T00:00:00.000Z');
          console.log('📅 Fecha convertida a', data.saleDate.toISOString());
        } else {
          data.saleDate = new Date(data.saleDate);
        }
      }

      const sale = await saleService.update(id, data);
      
      console.log('✅ Venta actualizada exitosamente:', sale.id);
      res.status(200).json({
        message: 'Venta actualizada exitosamente',
        data: sale
      });
    } catch (error) {
      console.error('❌ Error al actualizar venta:', error);
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

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await saleService.getStats();
      
      res.status(200).json({ data: stats });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }
}

export default new SaleController();
