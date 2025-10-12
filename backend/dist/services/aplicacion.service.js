"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ========================================
// SERVICE
// ========================================
class AplicacionMedicamentoService {
    // Crear aplicación y actualizar stock
    async create(data) {
        // Verificar que el medicamento existe y hay stock
        const medicamento = await prisma.medicamento.findUnique({
            where: { id: data.medicamentoId },
        });
        if (!medicamento) {
            throw new Error('Medicamento no encontrado');
        }
        // Crear la aplicación
        const aplicacion = await prisma.aplicacionMedicamento.create({
            data: {
                goatId: data.goatId,
                medicamentoId: data.medicamentoId,
                fechaAplicacion: data.fechaAplicacion ? new Date(data.fechaAplicacion) : new Date(),
                dosis: data.dosis,
                viaAdministrada: data.viaAdministrada,
                veterinario: data.veterinario,
                aplicadoPor: data.aplicadoPor,
                motivo: data.motivo,
                diagnostico: data.diagnostico,
                proximaDosis: data.proximaDosis ? new Date(data.proximaDosis) : null,
                frecuencia: data.frecuencia,
                observaciones: data.observaciones,
                reaccionAdversa: data.reaccionAdversa,
                efectividad: data.efectividad,
            },
            include: {
                goat: {
                    select: {
                        customId: true,
                        name: true,
                        breed: true,
                    },
                },
                medicamento: {
                    select: {
                        nombre: true,
                        tipo: true,
                        unidadMedida: true,
                    },
                },
            },
        });
        // Nota: No descontamos stock automáticamente porque puede ser aplicación retroactiva
        // El usuario debe actualizar manualmente desde el inventario
        return aplicacion;
    }
    // Aplicación masiva a múltiples cabras
    async createBulk(goatIds, aplicacionData) {
        const aplicaciones = await Promise.all(goatIds.map(goatId => this.create({ ...aplicacionData, goatId })));
        return aplicaciones;
    }
    // Obtener todas las aplicaciones
    async getAll(filters) {
        const where = {};
        if (filters?.goatId) {
            where.goatId = filters.goatId;
        }
        if (filters?.medicamentoId) {
            where.medicamentoId = filters.medicamentoId;
        }
        if (filters?.startDate || filters?.endDate) {
            where.fechaAplicacion = {};
            if (filters.startDate) {
                where.fechaAplicacion.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.fechaAplicacion.lte = new Date(filters.endDate);
            }
        }
        return await prisma.aplicacionMedicamento.findMany({
            where,
            include: {
                goat: {
                    select: {
                        customId: true,
                        name: true,
                        breed: true,
                        category: true,
                    },
                },
                medicamento: {
                    select: {
                        nombre: true,
                        tipo: true,
                        dosis: true,
                        unidadMedida: true,
                    },
                },
            },
            orderBy: { fechaAplicacion: 'desc' },
        });
    }
    // Obtener por ID
    async getById(id) {
        return await prisma.aplicacionMedicamento.findUnique({
            where: { id },
            include: {
                goat: true,
                medicamento: true,
            },
        });
    }
    // Actualizar aplicación
    async update(id, data) {
        const updateData = {};
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) {
                if (['fechaAplicacion', 'proximaDosis'].includes(key) && data[key]) {
                    updateData[key] = new Date(data[key]);
                }
                else {
                    updateData[key] = data[key];
                }
            }
        });
        return await prisma.aplicacionMedicamento.update({
            where: { id },
            data: updateData,
            include: {
                goat: {
                    select: {
                        customId: true,
                        name: true,
                    },
                },
                medicamento: {
                    select: {
                        nombre: true,
                    },
                },
            },
        });
    }
    // Eliminar aplicación
    async delete(id) {
        return await prisma.aplicacionMedicamento.delete({
            where: { id },
        });
    }
    // Obtener historial médico de una cabra
    async getHistorialMedico(goatId) {
        return await prisma.aplicacionMedicamento.findMany({
            where: { goatId },
            include: {
                medicamento: {
                    select: {
                        nombre: true,
                        tipo: true,
                        dosis: true,
                    },
                },
            },
            orderBy: { fechaAplicacion: 'desc' },
        });
    }
    // Obtener próximas dosis (calendario)
    async getProximasDosis(dias = 30) {
        const hoy = new Date();
        const fechaLimite = new Date(hoy.getTime() + dias * 24 * 60 * 60 * 1000);
        return await prisma.aplicacionMedicamento.findMany({
            where: {
                proximaDosis: {
                    gte: hoy,
                    lte: fechaLimite,
                },
            },
            include: {
                goat: {
                    select: {
                        customId: true,
                        name: true,
                        breed: true,
                    },
                },
                medicamento: {
                    select: {
                        nombre: true,
                        tipo: true,
                        dosis: true,
                    },
                },
            },
            orderBy: { proximaDosis: 'asc' },
        });
    }
    // Estadísticas de aplicaciones
    async getEstadisticas(filters) {
        const where = {};
        if (filters?.startDate || filters?.endDate) {
            where.fechaAplicacion = {};
            if (filters.startDate) {
                where.fechaAplicacion.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.fechaAplicacion.lte = new Date(filters.endDate);
            }
        }
        const aplicaciones = await prisma.aplicacionMedicamento.findMany({
            where,
            include: {
                medicamento: {
                    select: {
                        tipo: true,
                        nombre: true,
                        precioUnitario: true,
                    },
                },
            },
        });
        const porTipo = aplicaciones.reduce((acc, app) => {
            const tipo = app.medicamento.tipo;
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
        }, {});
        const medicamentosMasUsados = aplicaciones.reduce((acc, app) => {
            const nombre = app.medicamento.nombre;
            acc[nombre] = (acc[nombre] || 0) + 1;
            return acc;
        }, {});
        const topMedicamentos = Object.entries(medicamentosMasUsados)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }));
        return {
            totalAplicaciones: aplicaciones.length,
            porTipo,
            topMedicamentos,
            reaccionesAdversas: aplicaciones.filter(a => a.reaccionAdversa).length,
        };
    }
}
exports.default = new AplicacionMedicamentoService();
//# sourceMappingURL=aplicacion.service.js.map