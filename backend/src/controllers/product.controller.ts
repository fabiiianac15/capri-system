import { Request, Response } from 'express';
import { productService } from '../services/product.service';

export const productController = {
  async getAll(_req: Request, res: Response) {
    try {
      const products = await productService.getAll();
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const product = await productService.getById(id);
      
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ error: 'Error al obtener producto' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ error: 'Error al crear producto' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const product = await productService.update(id, req.body);
      res.json(product);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await productService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  },

  async createOutput(req: Request, res: Response) {
    try {
      const output = await productService.createOutput(req.body);
      res.status(201).json(output);
    } catch (error) {
      console.error('Error al registrar salida:', error);
      res.status(500).json({ error: 'Error al registrar salida' });
    }
  },

  async getOutputs(req: Request, res: Response) {
    try {
      const productId = req.params.productId;
      const outputs = await productService.getOutputs(productId);
      res.json(outputs);
    } catch (error) {
      console.error('Error al obtener salidas:', error);
      res.status(500).json({ error: 'Error al obtener salidas' });
    }
  },

  async getLowStock(_req: Request, res: Response) {
    try {
      const products = await productService.getLowStockProducts();
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos con bajo stock:', error);
      res.status(500).json({ error: 'Error al obtener productos con bajo stock' });
    }
  },

  async getStats(_req: Request, res: Response) {
    try {
      const stats = await productService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }
};
