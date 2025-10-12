import { Router, Request, Response } from 'express';
import medicamentoService from '../services/medicamento.service';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// ========================================
// CRUD MEDICAMENTOS
// ========================================

// GET /api/medicamentos - Obtener todos
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tipo, activo } = req.query;
    
    const filters: any = {};
    if (tipo) filters.tipo = tipo as string;
    if (activo !== undefined) filters.activo = activo === 'true';

    const medicamentos = await medicamentoService.getAll(filters);
    res.json(medicamentos);
  } catch (error: any) {
    console.error('Error al obtener medicamentos:', error);
    res.status(500).json({ error: error.message || 'Error al obtener medicamentos' });
  }
});

// GET /api/medicamentos/alertas - Obtener alertas
router.get('/alertas', async (_req: Request, res: Response) => {
  try {
    const alertas = await medicamentoService.getAlertas();
    res.json(alertas);
  } catch (error: any) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ error: error.message || 'Error al obtener alertas' });
  }
});

// GET /api/medicamentos/estadisticas - Obtener estadísticas
router.get('/estadisticas', async (_req: Request, res: Response) => {
  try {
    const stats = await medicamentoService.getEstadisticas();
    res.json(stats);
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: error.message || 'Error al obtener estadísticas' });
  }
});

// GET /api/medicamentos/:id - Obtener por ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const medicamento = await medicamentoService.getById(id);
    
    if (!medicamento) {
      res.status(404).json({ error: 'Medicamento no encontrado' });
      return;
    }
    
    res.json(medicamento);
  } catch (error: any) {
    console.error('Error al obtener medicamento:', error);
    res.status(500).json({ error: error.message || 'Error al obtener medicamento' });
  }
});

// POST /api/medicamentos - Crear medicamento
router.post('/', async (req: Request, res: Response) => {
  try {
    const medicamento = await medicamentoService.create(req.body);
    res.status(201).json(medicamento);
  } catch (error: any) {
    console.error('Error al crear medicamento:', error);
    res.status(500).json({ error: error.message || 'Error al crear medicamento' });
  }
});

// PUT /api/medicamentos/:id - Actualizar medicamento
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const medicamento = await medicamentoService.update(id, req.body);
    res.json(medicamento);
  } catch (error: any) {
    console.error('Error al actualizar medicamento:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar medicamento' });
  }
});

// PATCH /api/medicamentos/:id/stock - Actualizar stock
router.patch('/:id/stock', async (req: Request, res: Response): Promise<void> => {
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

    const medicamento = await medicamentoService.updateStock(id, cantidad, operacion);
    res.json(medicamento);
  } catch (error: any) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar stock' });
  }
});

// DELETE /api/medicamentos/:id - Eliminar (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const medicamento = await medicamentoService.delete(id);
    res.json({ message: 'Medicamento desactivado exitosamente', medicamento });
  } catch (error: any) {
    console.error('Error al eliminar medicamento:', error);
    res.status(500).json({ error: error.message || 'Error al eliminar medicamento' });
  }
});

export default router;
