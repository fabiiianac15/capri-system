"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monta_service_1 = __importDefault(require("../services/monta.service"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authenticateToken);
// ========================================
// CRUD MONTAS
// ========================================
// GET /api/montas - Obtener todas
router.get('/', async (req, res) => {
    try {
        const { hembraId, machoId, tipoEvento, activo } = req.query;
        const filters = {};
        if (hembraId)
            filters.hembraId = hembraId;
        if (machoId)
            filters.machoId = machoId;
        if (tipoEvento)
            filters.tipoEvento = tipoEvento;
        if (activo !== undefined)
            filters.activo = activo === 'true';
        const montas = await monta_service_1.default.getAll(filters);
        res.json(montas);
    }
    catch (error) {
        console.error('Error al obtener montas:', error);
        res.status(500).json({ error: error.message || 'Error al obtener montas' });
    }
});
// GET /api/montas/gestaciones-activas - Gestaciones en curso
router.get('/gestaciones-activas', async (_req, res) => {
    try {
        const gestaciones = await monta_service_1.default.getGestacionesActivas();
        res.json(gestaciones);
    }
    catch (error) {
        console.error('Error al obtener gestaciones activas:', error);
        res.status(500).json({ error: error.message || 'Error al obtener gestaciones activas' });
    }
});
// GET /api/montas/proximos-partos - Próximos partos
router.get('/proximos-partos', async (req, res) => {
    try {
        const dias = req.query.dias ? parseInt(req.query.dias) : 30;
        const proximosPartos = await monta_service_1.default.getProximosPartos(dias);
        res.json(proximosPartos);
    }
    catch (error) {
        console.error('Error al obtener próximos partos:', error);
        res.status(500).json({ error: error.message || 'Error al obtener próximos partos' });
    }
});
// GET /api/montas/estadisticas - Estadísticas generales
router.get('/estadisticas', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const filters = {};
        if (startDate)
            filters.startDate = startDate;
        if (endDate)
            filters.endDate = endDate;
        const stats = await monta_service_1.default.getEstadisticas(filters);
        res.json(stats);
    }
    catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: error.message || 'Error al obtener estadísticas' });
    }
});
// GET /api/montas/historial/hembra/:hembraId - Historial de una hembra
router.get('/historial/hembra/:hembraId', async (req, res) => {
    try {
        const { hembraId } = req.params;
        const historial = await monta_service_1.default.getHistorialHembra(hembraId);
        res.json(historial);
    }
    catch (error) {
        console.error('Error al obtener historial de hembra:', error);
        res.status(500).json({ error: error.message || 'Error al obtener historial de hembra' });
    }
});
// GET /api/montas/historial/macho/:machoId - Historial de un macho
router.get('/historial/macho/:machoId', async (req, res) => {
    try {
        const { machoId } = req.params;
        const historial = await monta_service_1.default.getHistorialMacho(machoId);
        res.json(historial);
    }
    catch (error) {
        console.error('Error al obtener historial de macho:', error);
        res.status(500).json({ error: error.message || 'Error al obtener historial de macho' });
    }
});
// GET /api/montas/:id - Obtener por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const monta = await monta_service_1.default.getById(id);
        if (!monta) {
            res.status(404).json({ error: 'Monta no encontrada' });
            return;
        }
        res.json(monta);
    }
    catch (error) {
        console.error('Error al obtener monta:', error);
        res.status(500).json({ error: error.message || 'Error al obtener monta' });
    }
});
// POST /api/montas - Registrar nueva monta
router.post('/', async (req, res) => {
    try {
        const monta = await monta_service_1.default.create(req.body);
        res.status(201).json(monta);
    }
    catch (error) {
        console.error('Error al crear monta:', error);
        res.status(500).json({ error: error.message || 'Error al crear monta' });
    }
});
// POST /api/montas/:id/parto - Registrar parto
router.post('/:id/parto', async (req, res) => {
    try {
        const { id } = req.params;
        const monta = await monta_service_1.default.registrarParto({
            montaId: id,
            ...req.body
        });
        res.json(monta);
    }
    catch (error) {
        console.error('Error al registrar parto:', error);
        res.status(500).json({ error: error.message || 'Error al registrar parto' });
    }
});
// POST /api/montas/:id/aborto - Registrar aborto
router.post('/:id/aborto', async (req, res) => {
    try {
        const { id } = req.params;
        const monta = await monta_service_1.default.registrarAborto(id, req.body);
        res.json(monta);
    }
    catch (error) {
        console.error('Error al registrar aborto:', error);
        res.status(500).json({ error: error.message || 'Error al registrar aborto' });
    }
});
// PUT /api/montas/:id - Actualizar monta
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const monta = await monta_service_1.default.update(id, req.body);
        res.json(monta);
    }
    catch (error) {
        console.error('Error al actualizar monta:', error);
        res.status(500).json({ error: error.message || 'Error al actualizar monta' });
    }
});
// DELETE /api/montas/:id - Eliminar monta
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await monta_service_1.default.delete(id);
        res.json({ message: 'Monta eliminada exitosamente' });
    }
    catch (error) {
        console.error('Error al eliminar monta:', error);
        res.status(500).json({ error: error.message || 'Error al eliminar monta' });
    }
});
exports.default = router;
//# sourceMappingURL=monta.routes.js.map