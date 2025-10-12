"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ========================================
// SERVICE
// ========================================
class MedicamentoService {
    // Crear medicamento
    async create(data) {
        return await prisma.medicamento.create({
            data: {
                nombre: data.nombre,
                tipo: data.tipo,
                descripcion: data.descripcion,
                dosis: data.dosis,
                viaAdministracion: data.viaAdministracion,
                fabricante: data.fabricante,
                lote: data.lote,
                fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
                stockActual: data.stockActual,
                stockMinimo: data.stockMinimo,
                unidadMedida: data.unidadMedida,
                precioUnitario: data.precioUnitario,
                ubicacionAlmacen: data.ubicacionAlmacen,
                condicionesAlmacenamiento: data.condicionesAlmacenamiento,
                notas: data.notas,
            },
        });
    }
    // Obtener todos los medicamentos
    async getAll(filters) {
        const where = {};
        if (filters?.tipo) {
            where.tipo = filters.tipo;
        }
        if (filters?.activo !== undefined) {
            where.activo = filters.activo;
        }
        return await prisma.medicamento.findMany({
            where,
            include: {
                aplicaciones: {
                    take: 5,
                    orderBy: { fechaAplicacion: 'desc' },
                    include: {
                        goat: {
                            select: {
                                customId: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: [
                { activo: 'desc' },
                { nombre: 'asc' },
            ],
        });
    }
    // Obtener por ID
    async getById(id) {
        return await prisma.medicamento.findUnique({
            where: { id },
            include: {
                aplicaciones: {
                    orderBy: { fechaAplicacion: 'desc' },
                    include: {
                        goat: {
                            select: {
                                customId: true,
                                name: true,
                                breed: true,
                            },
                        },
                    },
                },
            },
        });
    }
    // Actualizar medicamento
    async update(id, data) {
        const updateData = {};
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) {
                if (key === 'fechaVencimiento' && data[key]) {
                    updateData[key] = new Date(data[key]);
                }
                else {
                    updateData[key] = data[key];
                }
            }
        });
        return await prisma.medicamento.update({
            where: { id },
            data: updateData,
        });
    }
    // Actualizar stock
    async updateStock(id, cantidad, operacion) {
        const medicamento = await prisma.medicamento.findUnique({ where: { id } });
        if (!medicamento) {
            throw new Error('Medicamento no encontrado');
        }
        const nuevoStock = operacion === 'INCREMENTAR'
            ? medicamento.stockActual + cantidad
            : medicamento.stockActual - cantidad;
        if (nuevoStock < 0) {
            throw new Error('Stock no puede ser negativo');
        }
        return await prisma.medicamento.update({
            where: { id },
            data: { stockActual: nuevoStock },
        });
    }
    // Eliminar medicamento (soft delete)
    async delete(id) {
        return await prisma.medicamento.update({
            where: { id },
            data: { activo: false },
        });
    }
    // Eliminar permanentemente
    async hardDelete(id) {
        return await prisma.medicamento.delete({
            where: { id },
        });
    }
    // Obtener alertas (vencimientos y stock bajo)
    async getAlertas() {
        const medicamentos = await prisma.medicamento.findMany({
            where: { activo: true },
        });
        const alertas = [];
        const hoy = new Date();
        medicamentos.forEach(med => {
            // Alerta de vencimiento
            if (med.fechaVencimiento) {
                const diasParaVencer = Math.ceil((med.fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                if (diasParaVencer <= 0) {
                    alertas.push({
                        tipo: 'VENCIMIENTO',
                        medicamento: med,
                        mensaje: `${med.nombre} está VENCIDO`,
                        prioridad: 'ALTA',
                    });
                }
                else if (diasParaVencer <= 15) {
                    alertas.push({
                        tipo: 'VENCIMIENTO',
                        medicamento: med,
                        mensaje: `${med.nombre} vence en ${diasParaVencer} días`,
                        prioridad: 'ALTA',
                    });
                }
                else if (diasParaVencer <= 30) {
                    alertas.push({
                        tipo: 'VENCIMIENTO',
                        medicamento: med,
                        mensaje: `${med.nombre} vence en ${diasParaVencer} días`,
                        prioridad: 'MEDIA',
                    });
                }
            }
            // Alerta de stock bajo
            if (med.stockActual === 0) {
                alertas.push({
                    tipo: 'STOCK_CRITICO',
                    medicamento: med,
                    mensaje: `${med.nombre} - SIN STOCK`,
                    prioridad: 'ALTA',
                });
            }
            else if (med.stockActual <= med.stockMinimo * 0.5) {
                alertas.push({
                    tipo: 'STOCK_CRITICO',
                    medicamento: med,
                    mensaje: `${med.nombre} - Stock crítico: ${med.stockActual} ${med.unidadMedida}`,
                    prioridad: 'ALTA',
                });
            }
            else if (med.stockActual <= med.stockMinimo) {
                alertas.push({
                    tipo: 'STOCK_BAJO',
                    medicamento: med,
                    mensaje: `${med.nombre} - Stock bajo: ${med.stockActual} ${med.unidadMedida}`,
                    prioridad: 'MEDIA',
                });
            }
        });
        return alertas;
    }
    // Estadísticas
    async getEstadisticas() {
        const medicamentos = await prisma.medicamento.findMany({
            where: { activo: true },
        });
        const aplicaciones = await prisma.aplicacionMedicamento.count();
        const porTipo = medicamentos.reduce((acc, med) => {
            acc[med.tipo] = (acc[med.tipo] || 0) + 1;
            return acc;
        }, {});
        const stockBajo = medicamentos.filter(m => m.stockActual <= m.stockMinimo).length;
        const porVencer = medicamentos.filter(m => {
            if (!m.fechaVencimiento)
                return false;
            const dias = Math.ceil((m.fechaVencimiento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return dias > 0 && dias <= 30;
        }).length;
        return {
            totalMedicamentos: medicamentos.length,
            totalAplicaciones: aplicaciones,
            porTipo,
            stockBajo,
            porVencer,
            valorInventario: medicamentos.reduce((sum, m) => sum + (m.precioUnitario || 0) * m.stockActual, 0),
        };
    }
}
exports.default = new MedicamentoService();
//# sourceMappingURL=medicamento.service.js.map