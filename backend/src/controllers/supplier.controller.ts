import { Request, Response } from 'express';
import { supplierService } from '../services/supplier.service';

export const supplierController = {
  async getAll(_req: Request, res: Response) {
    try {
      const suppliers = await supplierService.getAll();
      res.json(suppliers);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const supplier = await supplierService.getById(id);
      
      if (!supplier) {
        res.status(404).json({ error: 'Proveedor no encontrado' });
        return;
      }
      
      res.json(supplier);
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      res.status(500).json({ error: 'Error al obtener proveedor' });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const supplier = await supplierService.create(req.body);
      res.status(201).json(supplier);
    } catch (error: any) {
      console.error('Error al crear proveedor:', error);
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'El NIT ya está registrado' });
        return;
      }
      res.status(500).json({ error: 'Error al crear proveedor' });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const supplier = await supplierService.update(id, req.body);
      res.json(supplier);
    } catch (error: any) {
      console.error('Error al actualizar proveedor:', error);
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'El NIT ya está registrado' });
        return;
      }
      res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await supplierService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
  },

  // Endpoints para cascada de ubicación
  async getCountries(_req: Request, res: Response) {
    try {
      const countries = await supplierService.getCountries();
      res.json(countries);
    } catch (error) {
      console.error('Error al obtener países:', error);
      res.status(500).json({ error: 'Error al obtener países' });
    }
  },

  async getStates(req: Request, res: Response) {
    try {
      const countryId = req.params.countryId;
      const states = await supplierService.getStatesByCountry(countryId);
      res.json(states);
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
      res.status(500).json({ error: 'Error al obtener departamentos' });
    }
  },

  async getCities(req: Request, res: Response) {
    try {
      const stateId = req.params.stateId;
      const cities = await supplierService.getCitiesByState(stateId);
      res.json(cities);
    } catch (error) {
      console.error('Error al obtener ciudades:', error);
      res.status(500).json({ error: 'Error al obtener ciudades' });
    }
  }
};
