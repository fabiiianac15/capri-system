"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aplicacion_service_1 = __importDefault(require("../services/aplicacion.service"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// ========================================
// CRUD APLICACIONES
// ========================================
// GET /api/aplicaciones - Obtener todas
router.get('/', async (req, res) => {
    try {
        const { goatId, medicamentoId, startDate, endDate } = req.query;
        const filters = {};
        if (goatId)
            filters.goatId = goatId;
        if (medicamentoId)
            filters.medicamentoId = medicamentoId;
        if (startDate)
            filters.startDate = startDate;
        if (endDate)
            filters.endDate = endDate;
        const aplicaciones = await aplicacion_service_1.default.getAll(filters);
        res.json(aplicaciones);
    }
    catch (error) {
        console.error('Error al obtener aplicaciones:', error);
        res.status(500).json({ error: error.message || 'Error al obtener aplicaciones' });
    }
});
// GET /api/aplicaciones/proximas-dosis - Obtener próximas dosis
router.get('/proximas-dosis', async (req, res) => {
    try {
        const dias = req.query.dias ? parseInt(req.query.dias) : 30;
        const proximasDosis = await aplicacion_service_1.default.getProximasDosis(dias);
        res.json(proximasDosis);
    }
    catch (error) {
        console.error('Error al obtener próximas dosis:', error);
        res.status(500).json({ error: error.message || 'Error al obtener próximas dosis' });
    }
});
// GET /api/aplicaciones/estadisticas - Obtener estadísticas
router.get('/estadisticas', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const filters = {};
        if (startDate)
            filters.startDate = startDate;
        if (endDate)
            filters.endDate = endDate;
        const stats = await aplicacion_service_1.default.getEstadisticas(filters);
        res.json(stats);
    }
    catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: error.message || 'Error al obtener estadísticas' });
    }
});
// GET /api/aplicaciones/:id - Obtener por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aplicacion = await aplicacion_service_1.default.getById(id);
        if (!aplicacion) {
            res.status(404).json({ error: 'Aplicación no encontrada' });
            return;
        }
        res.json(aplicacion);
    }
    catch (error) {
        console.error('Error al obtener aplicación:', error);
        res.status(500).json({ error: error.message || 'Error al obtener aplicación' });
    }
});
// POST /api/aplicaciones - Crear aplicación
router.post('/', async (req, res) => {
    try {
        const aplicacion = await aplicacion_service_1.default.create(req.body);
        res.status(201).json(aplicacion);
    }
    catch (error) {
        console.error('Error al crear aplicación:', error);
        res.status(500).json({ error: error.message || 'Error al crear aplicación' });
    }
});
// POST /api/aplicaciones/bulk - Aplicación masiva
router.post('/bulk', async (req, res) => {
    try {
        const { goatIds, ...aplicacionData } = req.body;
        if (!goatIds || !Array.isArray(goatIds) || goatIds.length === 0) {
            res.status(400).json({ error: 'Se requiere un array de goatIds' });
            return;
        }
        const aplicaciones = await aplicacion_service_1.default.createBulk(goatIds, aplicacionData);
        res.status(201).json(aplicaciones);
    }
    catch (error) {
        console.error('Error al crear aplicaciones masivas:', error);
        res.status(500).json({ error: error.message || 'Error al crear aplicaciones masivas' });
    }
});
// PUT /api/aplicaciones/:id - Actualizar aplicación
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aplicacion = await aplicacion_service_1.default.update(id, req.body);
        res.json(aplicacion);
    }
    catch (error) {
        console.error('Error al actualizar aplicación:', error);
        res.status(500).json({ error: error.message || 'Error al actualizar aplicación' });
    }
});
// DELETE /api/aplicaciones/:id - Eliminar aplicación
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await aplicacion_service_1.default.delete(id);
        res.json({ message: 'Aplicación eliminada exitosamente' });
    }
    catch (error) {
        console.error('Error al eliminar aplicación:', error);
        res.status(500).json({ error: error.message || 'Error al eliminar aplicación' });
    }
});
exports.default = router;
//# sourceMappingURL=aplicacion.routes.js.map