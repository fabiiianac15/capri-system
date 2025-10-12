"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ========================================
// SERVICIO DE MONTAS
// ========================================
class MontaService {
    /**
     * Registrar una nueva monta
     */
    async create(data) {
        // Validar que ambos animales existan y sean del sexo correcto
        const hembra = await prisma.goat.findUnique({
            where: { id: data.hembraId }
        });
        const macho = await prisma.goat.findUnique({
            where: { id: data.machoId }
        });
        if (!hembra || !macho) {
            throw new Error('Cabra o macho no encontrados');
        }
        if (hembra.sex !== 'FEMALE') {
            throw new Error('El primer animal debe ser hembra');
        }
        if (macho.sex !== 'MALE') {
            throw new Error('El segundo animal debe ser macho');
        }
        // Calcular fecha estimada de parto (150 días después de la monta)
        const fechaMonta = new Date(data.fechaMonta);
        const fechaEstimadaParto = new Date(fechaMonta);
        fechaEstimadaParto.setDate(fechaEstimadaParto.getDate() + 150);
        const monta = await prisma.monta.create({
            data: {
                hembraId: data.hembraId,
                machoId: data.machoId,
                machoCustomId: macho.customId,
                machoBreed: macho.breed,
                machoName: macho.name || undefined,
                fechaMonta: fechaMonta,
                fechaEstimadaParto,
                tipoEvento: 'GESTACION',
                notas: data.observaciones,
            },
            include: {
                hembra: true,
                macho: true,
            }
        });
        return monta;
    }
    /**
     * Obtener todas las montas con filtros
     */
    async getAll(filters) {
        const where = {};
        if (filters?.hembraId)
            where.hembraId = filters.hembraId;
        if (filters?.machoId)
            where.machoId = filters.machoId;
        if (filters?.tipoEvento)
            where.tipoEvento = filters.tipoEvento;
        if (filters?.activo !== undefined)
            where.activo = filters.activo;
        const montas = await prisma.monta.findMany({
            where,
            include: {
                hembra: true,
                macho: true,
            },
            orderBy: {
                fechaMonta: 'desc'
            }
        });
        return montas;
    }
    /**
     * Obtener monta por ID
     */
    async getById(id) {
        const monta = await prisma.monta.findUnique({
            where: { id },
            include: {
                hembra: true,
                macho: true,
            }
        });
        return monta;
    }
    /**
     * Actualizar monta
     */
    async update(id, data) {
        const monta = await prisma.monta.findUnique({
            where: { id }
        });
        if (!monta) {
            throw new Error('Monta no encontrada');
        }
        const updated = await prisma.monta.update({
            where: { id },
            data: {
                fechaEstimadaParto: data.fechaEstimadaParto,
                fechaParto: data.fechaParto,
                tipoEvento: data.tipoEvento,
                totalCrias: data.totalCrias,
                criasHembra: data.criasHembra,
                criasMacho: data.criasMacho,
                detallesCrias: data.detallesCrias ? JSON.stringify(data.detallesCrias) : undefined,
                complicaciones: data.complicaciones,
                veterinarioAsistio: data.asistenciaVeterinaria,
                inicioProduccionLeche: data.inicioProduccionLeche ? new Date() : undefined,
                produccionPromedio: data.produccionPromedio,
            },
            include: {
                hembra: true,
                macho: true,
            }
        });
        return updated;
    }
    /**
     * Registrar parto
     */
    async registrarParto(data) {
        const monta = await prisma.monta.findUnique({
            where: { id: data.montaId },
            include: {
                hembra: true,
                macho: true,
            }
        });
        if (!monta) {
            throw new Error('Monta no encontrada');
        }
        // Actualizar la monta con información del parto
        const montaActualizada = await prisma.monta.update({
            where: { id: data.montaId },
            data: {
                fechaParto: data.fechaParto,
                tipoEvento: 'PARTO_EXITOSO',
                totalCrias: data.totalCrias,
                criasHembra: data.criasHembra,
                criasMacho: data.criasMacho,
                detallesCrias: data.detallesCrias ? JSON.stringify(data.detallesCrias) : null,
                complicaciones: data.complicaciones,
                veterinarioAsistio: data.asistenciaVeterinaria || false,
                tratamientosPostParto: data.observacionesParto,
                inicioProduccionLeche: data.inicioProduccionLeche ? data.fechaParto : null,
            },
            include: {
                hembra: true,
                macho: true,
            }
        });
        // Si la hembra inició producción de leche, actualizar su categoría a REPRODUCTORA
        if (data.inicioProduccionLeche && monta.hembra.category !== 'REPRODUCTORA') {
            await prisma.goat.update({
                where: { id: monta.hembraId },
                data: {
                    category: 'REPRODUCTORA'
                }
            });
            // Registrar cambio de categoría
            await prisma.cambioCategoria.create({
                data: {
                    goatId: monta.hembraId,
                    categoriaAnterior: monta.hembra.category,
                    categoriaNueva: 'REPRODUCTORA',
                    pesoAlCambio: monta.hembra.weight || 0,
                    edadMeses: monta.hembra.birthDate
                        ? Math.floor((Date.now() - monta.hembra.birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
                        : undefined,
                    motivo: `PRIMER_PARTO - ${data.totalCrias} crías`,
                    realizadoPor: 'Sistema',
                }
            });
        }
        return montaActualizada;
    }
    /**
     * Registrar aborto
     */
    async registrarAborto(montaId, data) {
        const monta = await prisma.monta.findUnique({
            where: { id: montaId }
        });
        if (!monta) {
            throw new Error('Monta no encontrada');
        }
        const updated = await prisma.monta.update({
            where: { id: montaId },
            data: {
                fechaParto: data.fechaAborto,
                tipoEvento: 'ABORTO',
                tratamientosPostParto: data.observaciones,
                complicaciones: data.motivo,
            },
            include: {
                hembra: true,
                macho: true,
            }
        });
        return updated;
    }
    /**
     * Obtener gestaciones activas
     */
    async getGestacionesActivas() {
        const montas = await prisma.monta.findMany({
            where: {
                tipoEvento: 'GESTACION',
            },
            include: {
                hembra: true,
                macho: true,
            },
            orderBy: {
                fechaEstimadaParto: 'asc'
            }
        });
        // Calcular días restantes para cada gestación
        const hoy = new Date();
        const gestacionesConDias = montas.map((monta) => {
            const diasRestantes = monta.fechaEstimadaParto
                ? Math.ceil((monta.fechaEstimadaParto.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
                : null;
            return {
                ...monta,
                diasRestantes,
                diasGestacion: Math.ceil((hoy.getTime() - monta.fechaMonta.getTime()) / (1000 * 60 * 60 * 24)),
            };
        });
        return gestacionesConDias;
    }
    /**
     * Obtener próximos partos (próximos 30 días)
     */
    async getProximosPartos(dias = 30) {
        const hoy = new Date();
        const limite = new Date(hoy.getTime() + dias * 24 * 60 * 60 * 1000);
        const montas = await prisma.monta.findMany({
            where: {
                tipoEvento: 'GESTACION',
                fechaEstimadaParto: {
                    gte: hoy,
                    lte: limite,
                }
            },
            include: {
                hembra: true,
                macho: true,
            },
            orderBy: {
                fechaEstimadaParto: 'asc'
            }
        });
        return montas.map((monta) => ({
            ...monta,
            diasRestantes: Math.ceil((monta.fechaEstimadaParto.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)),
        }));
    }
    /**
     * Historial reproductivo de una hembra
     */
    async getHistorialHembra(hembraId) {
        const montas = await prisma.monta.findMany({
            where: {
                hembraId,
            },
            include: {
                macho: true,
            },
            orderBy: {
                fechaMonta: 'desc'
            }
        });
        // Calcular estadísticas
        const totalMontas = montas.length;
        const partos = montas.filter((m) => m.tipoEvento === 'PARTO_EXITOSO');
        const totalCrias = partos.reduce((sum, m) => sum + (m.totalCrias || 0), 0);
        const abortos = montas.filter((m) => m.tipoEvento === 'ABORTO').length;
        return {
            montas,
            estadisticas: {
                totalMontas,
                totalPartos: partos.length,
                totalCrias,
                totalHembras: partos.reduce((sum, m) => sum + (m.criasHembra || 0), 0),
                totalMachos: partos.reduce((sum, m) => sum + (m.criasMacho || 0), 0),
                abortos,
                tasaExito: totalMontas > 0 ? (partos.length / totalMontas * 100).toFixed(1) : 0,
                promedioXParto: partos.length > 0 ? (totalCrias / partos.length).toFixed(1) : 0,
            }
        };
    }
    /**
     * Historial reproductivo de un macho
     */
    async getHistorialMacho(machoId) {
        const montas = await prisma.monta.findMany({
            where: {
                machoId,
            },
            include: {
                hembra: true,
            },
            orderBy: {
                fechaMonta: 'desc'
            }
        });
        const totalMontas = montas.length;
        const partos = montas.filter((m) => m.tipoEvento === 'PARTO_EXITOSO');
        const totalCrias = partos.reduce((sum, m) => sum + (m.totalCrias || 0), 0);
        return {
            montas,
            estadisticas: {
                totalMontas,
                totalPartos: partos.length,
                totalCrias,
                totalHembras: partos.reduce((sum, m) => sum + (m.criasHembra || 0), 0),
                totalMachos: partos.reduce((sum, m) => sum + (m.criasMacho || 0), 0),
                tasaExito: totalMontas > 0 ? (partos.length / totalMontas * 100).toFixed(1) : 0,
            }
        };
    }
    /**
     * Estadísticas generales de reproducción
     */
    async getEstadisticas(filters) {
        const where = {};
        if (filters?.startDate || filters?.endDate) {
            where.fechaMonta = {};
            if (filters.startDate)
                where.fechaMonta.gte = new Date(filters.startDate);
            if (filters.endDate)
                where.fechaMonta.lte = new Date(filters.endDate);
        }
        const montas = await prisma.monta.findMany({ where });
        const totalMontas = montas.length;
        const gestacionesActivas = montas.filter((m) => m.tipoEvento === 'GESTACION').length;
        const partos = montas.filter((m) => m.tipoEvento === 'PARTO_EXITOSO');
        const abortos = montas.filter((m) => m.tipoEvento === 'ABORTO').length;
        const totalCrias = partos.reduce((sum, m) => sum + (m.totalCrias || 0), 0);
        // Machos más usados
        const montasPorMacho = {};
        montas.forEach((m) => {
            if (!montasPorMacho[m.machoId]) {
                montasPorMacho[m.machoId] = { count: 0, partos: 0, crias: 0 };
            }
            montasPorMacho[m.machoId].count++;
            if (m.tipoEvento === 'PARTO_EXITOSO') {
                montasPorMacho[m.machoId].partos++;
                montasPorMacho[m.machoId].crias += m.totalCrias || 0;
            }
        });
        const topMachos = await Promise.all(Object.entries(montasPorMacho)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(async ([machoId, stats]) => {
            const macho = await prisma.goat.findUnique({ where: { id: machoId } });
            return {
                macho,
                totalMontas: stats.count,
                partosExitosos: stats.partos,
                totalCrias: stats.crias,
                tasaExito: stats.count > 0 ? ((stats.partos / stats.count) * 100).toFixed(1) : 0,
            };
        }));
        return {
            totalMontas,
            gestacionesActivas,
            totalPartos: partos.length,
            abortos,
            totalCrias,
            criasHembra: partos.reduce((sum, m) => sum + (m.criasHembra || 0), 0),
            criasMacho: partos.reduce((sum, m) => sum + (m.criasMacho || 0), 0),
            tasaExito: totalMontas > 0 ? ((partos.length / totalMontas) * 100).toFixed(1) : 0,
            promedioXParto: partos.length > 0 ? (totalCrias / partos.length).toFixed(1) : 0,
            topMachos,
        };
    }
    /**
     * Eliminar monta
     */
    async delete(id) {
        const monta = await prisma.monta.findUnique({
            where: { id }
        });
        if (!monta) {
            throw new Error('Monta no encontrada');
        }
        await prisma.monta.delete({
            where: { id }
        });
        return { message: 'Monta eliminada exitosamente' };
    }
}
exports.default = new MontaService();
//# sourceMappingURL=monta.service.js.map