"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const staff_service_1 = __importDefault(require("../services/staff.service"));
class StaffController {
    async create(req, res) {
        try {
            const data = req.body;
            // Validaciones básicas
            if (!data.fullName || !data.dni || !data.staffType || !data.salary || data.yearsExperience === undefined || !data.startDate) {
                res.status(400).json({
                    error: 'Faltan campos requeridos: fullName, dni, staffType, salary, yearsExperience, startDate'
                });
                return;
            }
            // Convertir fechas
            data.startDate = new Date(data.startDate);
            if (data.endDate) {
                data.endDate = new Date(data.endDate);
            }
            const staff = await staff_service_1.default.create(data);
            res.status(201).json({
                message: 'Empleado registrado exitosamente',
                data: staff
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al registrar empleado' });
            }
        }
    }
    async getAll(req, res) {
        try {
            const { staffType } = req.query;
            const staff = await staff_service_1.default.getAll({
                staffType: staffType
            });
            res.status(200).json({
                data: staff,
                count: staff.length
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener empleados' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const staff = await staff_service_1.default.getById(id);
            res.status(200).json({ data: staff });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al obtener empleado' });
            }
        }
    }
    async update(req, res) {
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
            const staff = await staff_service_1.default.update(id, data);
            res.status(200).json({
                message: 'Empleado actualizado exitosamente',
                data: staff
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al actualizar empleado' });
            }
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const staff = await staff_service_1.default.delete(id);
            res.status(200).json({
                message: 'Empleado eliminado exitosamente',
                data: staff
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al eliminar empleado' });
            }
        }
    }
    async getStats(req, res) {
        try {
            const stats = await staff_service_1.default.getStats();
            res.status(200).json({ data: stats });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener estadísticas' });
        }
    }
    async getManagers(req, res) {
        try {
            const managers = await staff_service_1.default.getManagers();
            res.status(200).json({ data: managers });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener gerentes' });
        }
    }
}
exports.default = new StaffController();
//# sourceMappingURL=staff.controller.js.map