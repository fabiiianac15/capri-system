"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const goat_routes_1 = __importDefault(require("./routes/goat.routes"));
const supplier_routes_1 = __importDefault(require("./routes/supplier.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const staff_routes_1 = __importDefault(require("./routes/staff.routes"));
const sale_routes_1 = __importDefault(require("./routes/sale.routes"));
const medicamento_routes_1 = __importDefault(require("./routes/medicamento.routes"));
const aplicacion_routes_1 = __importDefault(require("./routes/aplicacion.routes"));
const monta_routes_1 = __importDefault(require("./routes/monta.routes"));
// Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// ========================================
// MIDDLEWARES
// ========================================
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175'
    ],
    credentials: true
}));
// Aumentar límite para imágenes en base64 (10MB)
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ========================================
// RUTAS BÁSICAS
// ========================================
app.get('/', (_req, res) => {
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
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// ========================================
// RUTAS DE LA API
// ========================================
app.use('/api/auth', auth_routes_1.default);
app.use('/api/goats', goat_routes_1.default);
app.use('/api/suppliers', supplier_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/staff', staff_routes_1.default);
app.use('/api/sales', sale_routes_1.default);
app.use('/api/medicamentos', medicamento_routes_1.default);
app.use('/api/aplicaciones', aplicacion_routes_1.default);
app.use('/api/montas', monta_routes_1.default);
// TODO: Agregar más rutas
// etc...
// ========================================
// MANEJO DE ERRORES 404
// ========================================
app.use((req, res) => {
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
server.on('error', (error) => {
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
exports.default = app;
//# sourceMappingURL=index.js.map