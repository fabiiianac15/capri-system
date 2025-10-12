"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const goat_service_1 = __importDefault(require("../services/goat.service"));
class GoatController {
    async create(req, res) {
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
            const goat = await goat_service_1.default.create(data);
            res.status(201).json({
                message: 'Cabra registrada exitosamente',
                data: goat
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al registrar cabra' });
            }
        }
    }
    async getAll(req, res) {
        try {
            const { category, breed, status, sex } = req.query;
            const goats = await goat_service_1.default.getAll({
                category: category,
                breed: breed,
                status: status,
                sex: sex
            });
            res.status(200).json({
                data: goats,
                count: goats.length
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener cabras' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const goat = await goat_service_1.default.getById(id);
            res.status(200).json({ data: goat });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al obtener cabra' });
            }
        }
    }
    async getByCustomId(req, res) {
        try {
            const { customId } = req.params;
            const goat = await goat_service_1.default.getByCustomId(customId);
            res.status(200).json({ data: goat });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al obtener cabra' });
            }
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const goat = await goat_service_1.default.update(id, data);
            res.status(200).json({
                message: 'Cabra actualizada exitosamente',
                data: goat
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al actualizar cabra' });
            }
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const goat = await goat_service_1.default.delete(id);
            res.status(200).json({
                message: 'Cabra eliminada exitosamente',
                data: goat
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al eliminar cabra' });
            }
        }
    }
    async getStats(req, res) {
        try {
            const stats = await goat_service_1.default.getStats();
            res.status(200).json({ data: stats });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener estadísticas' });
        }
    }
    async updateCategoryByWeight(req, res) {
        try {
            const { id } = req.params;
            const goat = await goat_service_1.default.updateCategoryByWeight(id);
            res.status(200).json({
                message: 'Categoría actualizada según peso',
                data: goat
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al actualizar categoría' });
            }
        }
    }
}
exports.default = new GoatController();
//# sourceMappingURL=goat.controller.js.map