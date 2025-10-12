"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierController = void 0;
const supplier_service_1 = require("../services/supplier.service");
exports.supplierController = {
    async getAll(req, res) {
        try {
            const suppliers = await supplier_service_1.supplierService.getAll();
            res.json(suppliers);
        }
        catch (error) {
            console.error('Error al obtener proveedores:', error);
            res.status(500).json({ error: 'Error al obtener proveedores' });
        }
    },
    async getById(req, res) {
        try {
            const id = req.params.id;
            const supplier = await supplier_service_1.supplierService.getById(id);
            if (!supplier) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }
            res.json(supplier);
        }
        catch (error) {
            console.error('Error al obtener proveedor:', error);
            res.status(500).json({ error: 'Error al obtener proveedor' });
        }
    },
    async create(req, res) {
        try {
            const supplier = await supplier_service_1.supplierService.create(req.body);
            res.status(201).json(supplier);
        }
        catch (error) {
            console.error('Error al crear proveedor:', error);
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'El NIT ya está registrado' });
            }
            res.status(500).json({ error: 'Error al crear proveedor' });
        }
    },
    async update(req, res) {
        try {
            const id = req.params.id;
            const supplier = await supplier_service_1.supplierService.update(id, req.body);
            res.json(supplier);
        }
        catch (error) {
            console.error('Error al actualizar proveedor:', error);
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'El NIT ya está registrado' });
            }
            res.status(500).json({ error: 'Error al actualizar proveedor' });
        }
    },
    async delete(req, res) {
        try {
            const id = req.params.id;
            await supplier_service_1.supplierService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error al eliminar proveedor:', error);
            res.status(500).json({ error: 'Error al eliminar proveedor' });
        }
    },
    // Endpoints para cascada de ubicación
    async getCountries(req, res) {
        try {
            const countries = await supplier_service_1.supplierService.getCountries();
            res.json(countries);
        }
        catch (error) {
            console.error('Error al obtener países:', error);
            res.status(500).json({ error: 'Error al obtener países' });
        }
    },
    async getStates(req, res) {
        try {
            const countryId = req.params.countryId;
            const states = await supplier_service_1.supplierService.getStatesByCountry(countryId);
            res.json(states);
        }
        catch (error) {
            console.error('Error al obtener departamentos:', error);
            res.status(500).json({ error: 'Error al obtener departamentos' });
        }
    },
    async getCities(req, res) {
        try {
            const stateId = req.params.stateId;
            const cities = await supplier_service_1.supplierService.getCitiesByState(stateId);
            res.json(cities);
        }
        catch (error) {
            console.error('Error al obtener ciudades:', error);
            res.status(500).json({ error: 'Error al obtener ciudades' });
        }
    }
};
//# sourceMappingURL=supplier.controller.js.map