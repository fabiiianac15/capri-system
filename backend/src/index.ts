import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import goatRoutes from './routes/goat.routes';
import supplierRoutes from './routes/supplier.routes';
import productRoutes from './routes/product.routes';
import staffRoutes from './routes/staff.routes';
import saleRoutes from './routes/sale.routes';
import medicamentoRoutes from './routes/medicamento.routes';
import aplicacionRoutes from './routes/aplicacion.routes';
import montaRoutes from './routes/monta.routes';

// Cargar variables de entorno
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// ========================================
// MIDDLEWARES
// ========================================
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true
}));
// Aumentar límite para imágenes en base64 (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// RUTAS BÁSICAS
// ========================================
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '🐐 CAPRI API - Sistema de Gestión Caprina',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      goats: '/api/goats',
      inventory: '/api/inventory',
      sales: '/api/sales',
      staff: '/api/staff',
      medicamentos: '/api/medicamentos',
      aplicaciones: '/api/aplicaciones',
      montas: '/api/montas'
    }
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ========================================
// RUTAS DE LA API
// ========================================
app.use('/api/auth', authRoutes);
app.use('/api/goats', goatRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/aplicaciones', aplicacionRoutes);
app.use('/api/montas', montaRoutes);
// TODO: Agregar más rutas
// etc...

// ========================================
// MANEJO DE ERRORES 404
// ========================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🐐 CAPRI API Server                 ║
║   Puerto: ${PORT}                        ║
║   Entorno: ${process.env.NODE_ENV}           ║
║   URL: http://localhost:${PORT}           ║
║                                        ║
║   Rutas disponibles:                   ║
║   POST /api/auth/register              ║
║   POST /api/auth/login                 ║
║   GET  /api/auth/profile               ║
╚════════════════════════════════════════╝
  `);
});

server.on('error', (error: Error) => {
  console.error('❌ Error en el servidor:', error);
  process.exit(1);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

export default app;
