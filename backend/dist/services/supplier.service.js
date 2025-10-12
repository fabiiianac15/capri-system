"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.supplierService = {
    async getAll() {
        return await prisma.supplier.findMany({
            include: {
                city: {
                    include: {
                        state: {
                            include: {
                                country: true
                            }
                        }
                    }
                },
                products: {
                    select: {
                        id: true,
                        name: true,
                        category: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },
    async getById(id) {
        return await prisma.supplier.findUnique({
            where: { id },
            include: {
                city: {
                    include: {
                        state: {
                            include: {
                                country: true
                            }
                        }
                    }
                },
                products: true
            }
        });
    },
    async create(data) {
        return await prisma.supplier.create({
            data,
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
        });
    },
    async update(id, data) {
        return await prisma.supplier.update({
            where: { id },
            data,
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
        });
    },
    async delete(id) {
        return await prisma.supplier.delete({
            where: { id }
        });
    },
    // Métodos auxiliares para cascada de ubicación
    async getCountries() {
        return await prisma.country.findMany({
            orderBy: { name: 'asc' }
        });
    },
    async getStatesByCountry(countryId) {
        return await prisma.state.findMany({
            where: { countryId },
            orderBy: { name: 'asc' }
        });
    },
    async getCitiesByState(stateId) {
        return await prisma.city.findMany({
            where: { stateId },
            orderBy: { name: 'asc' }
        });
    }
};
//# sourceMappingURL=supplier.service.js.map