"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const product_service_1 = require("../services/product.service");
exports.productController = {
    async getAll(_req, res) {
        try {
            const products = await product_service_1.productService.getAll();
            res.json(products);
        }
        catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    },
    async getById(req, res) {
        try {
            const id = req.params.id;
            const product = await product_service_1.productService.getById(id);
            if (!product) {
                res.status(404).json({ error: 'Producto no encontrado' });
                return;
            }
            res.json(product);
        }
        catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({ error: 'Error al obtener producto' });
        }
    },
    async create(req, res) {
        try {
            const product = await product_service_1.productService.create(req.body);
            res.status(201).json(product);
        }
        catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({ error: 'Error al crear producto' });
        }
    },
    async update(req, res) {
        try {
            const id = req.params.id;
            const product = await product_service_1.productService.update(id, req.body);
            res.json(product);
        }
        catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({ error: 'Error al actualizar producto' });
        }
    },
    async delete(req, res) {
        try {
            const id = req.params.id;
            await product_service_1.productService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({ error: 'Error al eliminar producto' });
        }
    },
    async createOutput(req, res) {
        try {
            const output = await product_service_1.productService.createOutput(req.body);
            res.status(201).json(output);
        }
        catch (error) {
            console.error('Error al registrar salida:', error);
            res.status(500).json({ error: 'Error al registrar salida' });
        }
    },
    async getOutputs(req, res) {
        try {
            const productId = req.params.productId;
            const outputs = await product_service_1.productService.getOutputs(productId);
            res.json(outputs);
        }
        catch (error) {
            console.error('Error al obtener salidas:', error);
            res.status(500).json({ error: 'Error al obtener salidas' });
        }
    },
    async getLowStock(_req, res) {
        try {
            const products = await product_service_1.productService.getLowStockProducts();
            res.json(products);
        }
        catch (error) {
            console.error('Error al obtener productos con bajo stock:', error);
            res.status(500).json({ error: 'Error al obtener productos con bajo stock' });
        }
    },
    async getStats(_req, res) {
        try {
            const stats = await product_service_1.productService.getStats();
            res.json(stats);
        }
        catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({ error: 'Error al obtener estadísticas' });
        }
    }
};
//# sourceMappingURL=product.controller.js.map