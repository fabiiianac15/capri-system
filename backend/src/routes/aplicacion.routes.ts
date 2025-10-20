import { Router, Request, Response } from 'express';
import aplicacionService from '../services/aplicacion.service';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// ========================================
// CRUD APLICACIONES
// ========================================

// GET /api/aplicaciones - Obtener todas
router.get('/', async (req: Request, res: Response) => {
  try {
    const { goatId, medicamentoId, startDate, endDate } = req.query;
    
    const filters: any = {};
    if (goatId) filters.goatId = goatId as string;
    if (medicamentoId) filters.medicamentoId = medicamentoId as string;
    if (startDate) filters.startDate = startDate as string;
    if (endDate) filters.endDate = endDate as string;

    const aplicaciones = await aplicacionService.getAll(filters);
    res.json(aplicaciones);
  } catch (error: any) {
    console.error('Error al obtener aplicaciones:', error);
    res.status(500).json({ error: error.message || 'Error al obtener aplicaciones' });
  }
});

// GET /api/aplicaciones/proximas-dosis - Obtener próximas dosis
router.get('/proximas-dosis', async (req: Request, res: Response) => {
  try {
    const dias = req.query.dias ? parseInt(req.query.dias as string) : 30;
    const proximasDosis = await aplicacionService.getProximasDosis(dias);
    res.json(proximasDosis);
  } catch (error: any) {
    console.error('Error al obtener próximas dosis:', error);
    res.status(500).json({ error: error.message || 'Error al obtener próximas dosis' });
  }
});

// GET /api/aplicaciones/estadisticas - Obtener estadísticas
router.get('/estadisticas', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters: any = {};
    if (startDate) filters.startDate = startDate as string;
    if (endDate) filters.endDate = endDate as string;

    const stats = await aplicacionService.getEstadisticas(filters);
    res.json(stats);
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: error.message || 'Error al obtener estadísticas' });
  }
});

// GET /api/aplicaciones/:id - Obtener por ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const aplicacion = await aplicacionService.getById(id);
    
    if (!aplicacion) {
      res.status(404).json({ error: 'Aplicación no encontrada' });
      return;
    }
    
    res.json(aplicacion);
  } catch (error: any) {
    console.error('Error al obtener aplicación:', error);
    res.status(500).json({ error: error.message || 'Error al obtener aplicación' });
  }
});

// POST /api/aplicaciones - Crear aplicación
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      createdById: req.user?.userId
    };
    const aplicacion = await aplicacionService.create(data);
    res.status(201).json(aplicacion);
  } catch (error: any) {
    console.error('Error al crear aplicación:', error);
    res.status(500).json({ error: error.message || 'Error al crear aplicación' });
  }
});

// POST /api/aplicaciones/bulk - Aplicación masiva
router.post('/bulk', async (req: Request, res: Response): Promise<void> => {
  try {
    const { goatIds, ...aplicacionData } = req.body;

    if (!goatIds || !Array.isArray(goatIds) || goatIds.length === 0) {
      res.status(400).json({ error: 'Se requiere un array de goatIds' });
      return;
    }

    const dataWithUser = {
      ...aplicacionData,
      createdById: req.user?.userId
    };

    const aplicaciones = await aplicacionService.createBulk(goatIds, dataWithUser);
    res.status(201).json(aplicaciones);
  } catch (error: any) {
    console.error('Error al crear aplicaciones masivas:', error);
    res.status(500).json({ error: error.message || 'Error al crear aplicaciones masivas' });
  }
});

// PUT /api/aplicaciones/:id - Actualizar aplicación
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const aplicacion = await aplicacionService.update(id, req.body);
    res.json(aplicacion);
  } catch (error: any) {
    console.error('Error al actualizar aplicación:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar aplicación' });
  }
});

// DELETE /api/aplicaciones/:id - Eliminar aplicación
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await aplicacionService.delete(id);
    res.json({ message: 'Aplicación eliminada exitosamente' });
  } catch (error: any) {
    console.error('Error al eliminar aplicación:', error);
    res.status(500).json({ error: error.message || 'Error al eliminar aplicación' });
  }
});

export default router;
