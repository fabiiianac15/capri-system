"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicamento_service_1 = __importDefault(require("../services/medicamento.service"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// ========================================
// CRUD MEDICAMENTOS
// ========================================
// GET /api/medicamentos - Obtener todos
router.get('/', async (req, res) => {
    try {
        const { tipo, activo } = req.query;
        const filters = {};
        if (tipo)
            filters.tipo = tipo;
        if (activo !== undefined)
            filters.activo = activo === 'true';
        const medicamentos = await medicamento_service_1.default.getAll(filters);
        res.json(medicamentos);
    }
    catch (error) {
        console.error('Error al obtener medicamentos:', error);
        res.status(500).json({ error: error.message || 'Error al obtener medicamentos' });
    }
});
// GET /api/medicamentos/alertas - Obtener alertas
router.get('/alertas', async (_req, res) => {
    try {
        const alertas = await medicamento_service_1.default.getAlertas();
        res.json(alertas);
    }
    catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ error: error.message || 'Error al obtener alertas' });
    }
});
// GET /api/medicamentos/estadisticas - Obtener estadísticas
router.get('/estadisticas', async (_req, res) => {
    try {
        const stats = await medicamento_service_1.default.getEstadisticas();
        res.json(stats);
    }
    catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: error.message || 'Error al obtener estadísticas' });
    }
});
// GET /api/medicamentos/:id - Obtener por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const medicamento = await medicamento_service_1.default.getById(id);
        if (!medicamento) {
            res.status(404).json({ error: 'Medicamento no encontrado' });
            return;
        }
        res.json(medicamento);
    }
    catch (error) {
        console.error('Error al obtener medicamento:', error);
        res.status(500).json({ error: error.message || 'Error al obtener medicamento' });
    }
});
// POST /api/medicamentos - Crear medicamento
router.post('/', async (req, res) => {
    try {
        const medicamento = await medicamento_service_1.default.create(req.body);
        res.status(201).json(medicamento);
    }
    catch (error) {
        console.error('Error al crear medicamento:', error);
        res.status(500).json({ error: error.message || 'Error al crear medicamento' });
    }
});
// PUT /api/medicamentos/:id - Actualizar medicamento
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const medicamento = await medicamento_service_1.default.update(id, req.body);
        res.json(medicamento);
    }
    catch (error) {
        console.error('Error al actualizar medicamento:', error);
        res.status(500).json({ error: error.message || 'Error al actualizar medicamento' });
    }
});
// PATCH /api/medicamentos/:id/stock - Actualizar stock
router.patch('/:id/stock', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad, operacion } = req.body;
        if (!cantidad || !operacion) {
            res.status(400).json({ error: 'Cantidad y operación son requeridos' });
            return;
        }
        if (!['INCREMENTAR', 'DECREMENTAR'].includes(operacion)) {
            res.status(400).json({ error: 'Operación debe ser INCREMENTAR o DECREMENTAR' });
            return;
        }
        const medicamento = await medicamento_service_1.default.updateStock(id, cantidad, operacion);
        res.json(medicamento);
    }
    catch (error) {
        console.error('Error al actualizar stock:', error);
        res.status(500).json({ error: error.message || 'Error al actualizar stock' });
    }
});
// DELETE /api/medicamentos/:id - Eliminar (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const medicamento = await medicamento_service_1.default.delete(id);
        res.json({ message: 'Medicamento desactivado exitosamente', medicamento });
    }
    catch (error) {
        console.error('Error al eliminar medicamento:', error);
        res.status(500).json({ error: error.message || 'Error al eliminar medicamento' });
    }
});
exports.default = router;
//# sourceMappingURL=medicamento.routes.js.map