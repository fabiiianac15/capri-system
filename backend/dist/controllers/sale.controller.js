"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sale_service_1 = __importDefault(require("../services/sale.service"));
class SaleController {
    async create(req, res) {
        try {
            const data = req.body;
            const userId = req.user?.userId;
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
            const sale = await sale_service_1.default.create({
                ...data,
                userId
            });
            res.status(201).json({
                message: 'Venta registrada exitosamente',
                data: sale
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al registrar venta' });
            }
        }
    }
    async getAll(req, res) {
        try {
            const { productType, paymentStatus, startDate, endDate } = req.query;
            const sales = await sale_service_1.default.getAll({
                productType: productType,
                paymentStatus: paymentStatus,
                startDate: startDate,
                endDate: endDate
            });
            res.status(200).json({
                data: sales,
                count: sales.length
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener ventas' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const sale = await sale_service_1.default.getById(id);
            res.status(200).json({ data: sale });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al obtener venta' });
            }
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const sale = await sale_service_1.default.update(id, data);
            res.status(200).json({
                message: 'Venta actualizada exitosamente',
                data: sale
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al actualizar venta' });
            }
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const sale = await sale_service_1.default.delete(id);
            res.status(200).json({
                message: 'Venta eliminada exitosamente',
                data: sale
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error al eliminar venta' });
            }
        }
    }
    async getStats(_req, res) {
        try {
            const stats = await sale_service_1.default.getStats();
            res.status(200).json({ data: stats });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener estadísticas' });
        }
    }
}
exports.default = new SaleController();
//# sourceMappingURL=sale.controller.js.map