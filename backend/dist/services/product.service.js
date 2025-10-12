"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.productService = {
    async getAll() {
        return await prisma.product.findMany({
            include: {
                supplier: {
                    include: {
                        city: {
                            include: {
                                state: {
                                    include: {
                                        country: true
                                    }
                                }
                            }
                        }
                    }
                },
                outputs: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        date: 'desc'
                    },
                    take: 5 // Últimas 5 salidas
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },
    async getById(id) {
        return await prisma.product.findUnique({
            where: { id },
            include: {
                supplier: {
                    include: {
                        city: {
                            include: {
                                state: {
                                    include: {
                                        country: true
                                    }
                                }
                            }
                        }
                    }
                },
                outputs: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        date: 'desc'
                    }
                }
            }
        });
    },
    async create(data) {
        return await prisma.product.create({
            data,
            include: {
                supplier: true
            }
        });
    },
    async update(id, data) {
        return await prisma.product.update({
            where: { id },
            data,
            include: {
                supplier: true
            }
        });
    },
    async delete(id) {
        return await prisma.product.delete({
            where: { id }
        });
    },
    async createOutput(data) {
        // Crear la salida
        const output = await prisma.inventoryOutput.create({
            data,
            include: {
                product: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        // Actualizar el stock del producto
        await prisma.product.update({
            where: { id: data.productId },
            data: {
                currentStock: {
                    decrement: data.quantity
                }
            }
        });
        return output;
    },
    async getOutputs(productId) {
        return await prisma.inventoryOutput.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
    },
    async getLowStockProducts() {
        return await prisma.product.findMany({
            where: {
                currentStock: {
                    lte: prisma.product.fields.minStock
                }
            },
            include: {
                supplier: true
            },
            orderBy: {
                currentStock: 'asc'
            }
        });
    },
    async getStats() {
        const total = await prisma.product.count();
        const lowStock = await prisma.product.count({
            where: {
                currentStock: {
                    lte: prisma.product.fields.minStock
                }
            }
        });
        const byCategory = await prisma.product.groupBy({
            by: ['category'],
            _count: {
                category: true
            },
            _sum: {
                currentStock: true
            }
        });
        const totalValue = await prisma.product.aggregate({
            _sum: {
                price: true
            }
        });
        return {
            total,
            lowStock,
            byCategory,
            totalValue: totalValue._sum.price || 0
        };
    }
};
//# sourceMappingURL=product.service.js.map