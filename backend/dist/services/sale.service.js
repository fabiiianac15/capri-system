"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SaleService {
    async create(data) {
        // Validar que si es CABRA_VIVA, se proporcione goatId
        if (data.productType === 'CABRA_VIVA' && !data.goatId) {
            throw new Error('Para venta de cabra viva debe seleccionar una cabra');
        }
        // Si hay goatId, verificar que la cabra exista y esté activa
        if (data.goatId) {
            const goat = await prisma.goat.findUnique({
                where: { id: data.goatId }
            });
            if (!goat) {
                throw new Error('La cabra seleccionada no existe');
            }
            if (goat.status !== 'ACTIVE') {
                throw new Error('La cabra seleccionada no está activa');
            }
        }
        const sale = await prisma.sale.create({
            data: {
                ...data,
                saleDate: data.saleDate || new Date()
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                goat: {
                    select: {
                        id: true,
                        customId: true,
                        name: true,
                        breed: true
                    }
                }
            }
        });
        // Si es venta de cabra viva, actualizar el estado de la cabra a SOLD
        if (data.goatId && data.productType === 'CABRA_VIVA') {
            await prisma.goat.update({
                where: { id: data.goatId },
                data: { status: 'SOLD' }
            });
        }
        return sale;
    }
    async getAll(filters) {
        const where = {};
        if (filters?.productType) {
            where.productType = filters.productType;
        }
        if (filters?.paymentStatus) {
            where.paymentStatus = filters.paymentStatus;
        }
        if (filters?.startDate || filters?.endDate) {
            where.saleDate = {};
            if (filters.startDate) {
                where.saleDate.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.saleDate.lte = new Date(filters.endDate);
            }
        }
        const sales = await prisma.sale.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                goat: {
                    select: {
                        id: true,
                        customId: true,
                        name: true,
                        breed: true
                    }
                }
            },
            orderBy: {
                saleDate: 'desc'
            }
        });
        return sales;
    }
    async getById(id) {
        const sale = await prisma.sale.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                goat: {
                    select: {
                        id: true,
                        customId: true,
                        name: true,
                        breed: true,
                        weight: true
                    }
                }
            }
        });
        if (!sale) {
            throw new Error('Venta no encontrada');
        }
        return sale;
    }
    async update(id, data) {
        const sale = await prisma.sale.findUnique({
            where: { id }
        });
        if (!sale) {
            throw new Error('Venta no encontrada');
        }
        // Si se está actualizando goatId, validar
        if (data.goatId) {
            const goat = await prisma.goat.findUnique({
                where: { id: data.goatId }
            });
            if (!goat) {
                throw new Error('La cabra seleccionada no existe');
            }
        }
        const updated = await prisma.sale.update({
            where: { id },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                goat: {
                    select: {
                        id: true,
                        customId: true,
                        name: true,
                        breed: true
                    }
                }
            }
        });
        return updated;
    }
    async delete(id) {
        const sale = await prisma.sale.findUnique({
            where: { id },
            include: {
                goat: true
            }
        });
        if (!sale) {
            throw new Error('Venta no encontrada');
        }
        // Si la venta tenía una cabra asociada y era CABRA_VIVA, revertir el estado
        if (sale.goatId && sale.productType === 'CABRA_VIVA') {
            await prisma.goat.update({
                where: { id: sale.goatId },
                data: { status: 'ACTIVE' }
            });
        }
        const deleted = await prisma.sale.delete({
            where: { id }
        });
        return deleted;
    }
    async getStats() {
        const [total, byProductType, byPaymentStatus, totalRevenue, avgSaleValue] = await Promise.all([
            prisma.sale.count(),
            prisma.sale.groupBy({
                by: ['productType'],
                _count: true,
                _sum: {
                    totalPrice: true
                }
            }),
            prisma.sale.groupBy({
                by: ['paymentStatus'],
                _count: true
            }),
            prisma.sale.aggregate({
                _sum: {
                    totalPrice: true
                }
            }),
            prisma.sale.aggregate({
                _avg: {
                    totalPrice: true
                }
            })
        ]);
        return {
            total,
            byProductType: byProductType.map(t => ({
                productType: t.productType,
                count: t._count,
                revenue: t._sum.totalPrice || 0
            })),
            byPaymentStatus: byPaymentStatus.map(t => ({
                paymentStatus: t.paymentStatus,
                count: t._count
            })),
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            avgSaleValue: avgSaleValue._avg.totalPrice || 0
        };
    }
}
exports.default = new SaleService();
//# sourceMappingURL=sale.service.js.map