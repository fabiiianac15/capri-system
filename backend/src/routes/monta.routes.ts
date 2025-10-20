import { Router, Request, Response } from 'express';
import montaService from '../services/monta.service';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// ========================================
// CRUD MONTAS
// ========================================

// GET /api/montas - Obtener todas
router.get('/', async (req: Request, res: Response) => {
  try {
    const { hembraId, machoId, tipoEvento, activo } = req.query;
    
    const filters: any = {};
    if (hembraId) filters.hembraId = hembraId as string;
    if (machoId) filters.machoId = machoId as string;
    if (tipoEvento) filters.tipoEvento = tipoEvento as string;
    if (activo !== undefined) filters.activo = activo === 'true';

    const montas = await montaService.getAll(filters);
    res.json(montas);
  } catch (error: any) {
    console.error('Error al obtener montas:', error);
    res.status(500).json({ error: error.message || 'Error al obtener montas' });
  }
});

// GET /api/montas/gestaciones-activas - Gestaciones en curso
router.get('/gestaciones-activas', async (_req: Request, res: Response) => {
  try {
    const gestaciones = await montaService.getGestacionesActivas();
    res.json(gestaciones);
  } catch (error: any) {
    console.error('Error al obtener gestaciones activas:', error);
    res.status(500).json({ error: error.message || 'Error al obtener gestaciones activas' });
  }
});

// GET /api/montas/proximos-partos - Próximos partos
router.get('/proximos-partos', async (req: Request, res: Response) => {
  try {
    const dias = req.query.dias ? parseInt(req.query.dias as string) : 30;
    const proximosPartos = await montaService.getProximosPartos(dias);
    res.json(proximosPartos);
  } catch (error: any) {
    console.error('Error al obtener próximos partos:', error);
    res.status(500).json({ error: error.message || 'Error al obtener próximos partos' });
  }
});

// GET /api/montas/estadisticas - Estadísticas generales
router.get('/estadisticas', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters: any = {};
    if (startDate) filters.startDate = startDate as string;
    if (endDate) filters.endDate = endDate as string;

    const stats = await montaService.getEstadisticas(filters);
    res.json(stats);
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: error.message || 'Error al obtener estadísticas' });
  }
});

// GET /api/montas/historial/hembra/:hembraId - Historial de una hembra
router.get('/historial/hembra/:hembraId', async (req: Request, res: Response) => {
  try {
    const { hembraId } = req.params;
    const historial = await montaService.getHistorialHembra(hembraId);
    res.json(historial);
  } catch (error: any) {
    console.error('Error al obtener historial de hembra:', error);
    res.status(500).json({ error: error.message || 'Error al obtener historial de hembra' });
  }
});

// GET /api/montas/historial/macho/:machoId - Historial de un macho
router.get('/historial/macho/:machoId', async (req: Request, res: Response) => {
  try {
    const { machoId } = req.params;
    const historial = await montaService.getHistorialMacho(machoId);
    res.json(historial);
  } catch (error: any) {
    console.error('Error al obtener historial de macho:', error);
    res.status(500).json({ error: error.message || 'Error al obtener historial de macho' });
  }
});

// GET /api/montas/:id - Obtener por ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const monta = await montaService.getById(id);
    
    if (!monta) {
      res.status(404).json({ error: 'Monta no encontrada' });
      return;
    }
    
    res.json(monta);
  } catch (error: any) {
    console.error('Error al obtener monta:', error);
    res.status(500).json({ error: error.message || 'Error al obtener monta' });
  }
});

// POST /api/montas - Registrar nueva monta
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      createdById: req.user?.userId
    };
    const monta = await montaService.create(data);
    res.status(201).json(monta);
  } catch (error: any) {
    console.error('Error al crear monta:', error);
    res.status(500).json({ error: error.message || 'Error al crear monta' });
  }
});

// POST /api/montas/:id/parto - Registrar parto
router.post('/:id/parto', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const monta = await montaService.registrarParto({
      montaId: id,
      ...req.body
    });
    res.json(monta);
  } catch (error: any) {
    console.error('Error al registrar parto:', error);
    res.status(500).json({ error: error.message || 'Error al registrar parto' });
  }
});

// POST /api/montas/:id/aborto - Registrar aborto
router.post('/:id/aborto', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const monta = await montaService.registrarAborto(id, req.body);
    res.json(monta);
  } catch (error: any) {
    console.error('Error al registrar aborto:', error);
    res.status(500).json({ error: error.message || 'Error al registrar aborto' });
  }
});

// PUT /api/montas/:id - Actualizar monta
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const monta = await montaService.update(id, req.body);
    res.json(monta);
  } catch (error: any) {
    console.error('Error al actualizar monta:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar monta' });
  }
});

// DELETE /api/montas/:id - Eliminar monta
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await montaService.delete(id);
    res.json({ message: 'Monta eliminada exitosamente' });
  } catch (error: any) {
    console.error('Error al eliminar monta:', error);
    res.status(500).json({ error: error.message || 'Error al eliminar monta' });
  }
});

export default router;
