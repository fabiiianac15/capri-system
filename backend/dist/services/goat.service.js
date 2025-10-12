"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class GoatService {
    // Crear cabra
    async create(data) {
        // Verificar que el customId no exista
        const existing = await prisma.goat.findUnique({
            where: { customId: data.customId }
        });
        if (existing) {
            throw new Error(`Ya existe una cabra con ID ${data.customId}`);
        }
        return await prisma.goat.create({
            data: {
                customId: data.customId,
                name: data.name,
                breed: data.breed,
                sex: data.sex,
                birthDate: data.birthDate,
                weight: data.weight,
                category: data.category || 'CRIA',
                motherId: data.motherId,
                fatherId: data.fatherId,
                notes: data.notes
            },
            include: {
                mother: {
                    select: { id: true, customId: true, name: true }
                },
                vaccines: true
            }
        });
    }
    // Obtener todas las cabras con filtros
    async getAll(filters) {
        const where = {};
        if (filters?.category)
            where.category = filters.category;
        if (filters?.breed)
            where.breed = filters.breed;
        if (filters?.status)
            where.status = filters.status;
        if (filters?.sex)
            where.sex = filters.sex;
        return await prisma.goat.findMany({
            where,
            include: {
                mother: {
                    select: { id: true, customId: true, name: true }
                },
                vaccines: {
                    take: 3,
                    orderBy: { applicationDate: 'desc' }
                },
                reproductiveData: {
                    take: 1,
                    orderBy: { mountingDate: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    // Obtener una cabra por ID
    async getById(id) {
        const goat = await prisma.goat.findUnique({
            where: { id },
            include: {
                mother: {
                    select: { id: true, customId: true, name: true, breed: true }
                },
                offspring: {
                    select: { id: true, customId: true, name: true, sex: true, birthDate: true }
                },
                vaccines: {
                    orderBy: { applicationDate: 'desc' }
                },
                reproductiveData: {
                    orderBy: { mountingDate: 'desc' }
                }
            }
        });
        if (!goat) {
            throw new Error('Cabra no encontrada');
        }
        return goat;
    }
    // Obtener por customId
    async getByCustomId(customId) {
        const goat = await prisma.goat.findUnique({
            where: { customId },
            include: {
                mother: true,
                offspring: true,
                vaccines: true,
                reproductiveData: true
            }
        });
        if (!goat) {
            throw new Error(`Cabra con ID ${customId} no encontrada`);
        }
        return goat;
    }
    // Actualizar cabra
    async update(id, data) {
        const goat = await prisma.goat.findUnique({ where: { id } });
        if (!goat) {
            throw new Error('Cabra no encontrada');
        }
        return await prisma.goat.update({
            where: { id },
            data,
            include: {
                mother: true,
                vaccines: true
            }
        });
    }
    // Eliminar cabra (soft delete - cambiar estado)
    async delete(id) {
        const goat = await prisma.goat.findUnique({ where: { id } });
        if (!goat) {
            throw new Error('Cabra no encontrada');
        }
        return await prisma.goat.update({
            where: { id },
            data: { status: 'DECEASED' }
        });
    }
    // Estadísticas generales
    async getStats() {
        const total = await prisma.goat.count({
            where: { status: 'ACTIVE' }
        });
        const byCategory = await prisma.goat.groupBy({
            by: ['category'],
            where: { status: 'ACTIVE' },
            _count: true
        });
        const byBreed = await prisma.goat.groupBy({
            by: ['breed'],
            where: { status: 'ACTIVE' },
            _count: true
        });
        const bySex = await prisma.goat.groupBy({
            by: ['sex'],
            where: { status: 'ACTIVE' },
            _count: true
        });
        const totalMilk = await prisma.goat.aggregate({
            where: { status: 'ACTIVE' },
            _sum: { milkProduction: true }
        });
        return {
            total,
            byCategory,
            byBreed,
            bySex,
            totalMilkProduction: totalMilk._sum.milkProduction || 0
        };
    }
    // Actualizar categoría automática por peso
    async updateCategoryByWeight(id) {
        const goat = await prisma.goat.findUnique({ where: { id } });
        if (!goat || !goat.weight) {
            throw new Error('Cabra no encontrada o sin peso registrado');
        }
        let newCategory = goat.category;
        if (goat.sex === 'FEMALE') {
            if (goat.weight >= 35) {
                newCategory = 'LECHERA';
            }
            else if (goat.weight >= 25) {
                newCategory = 'LEVANTE_2';
            }
            else if (goat.weight >= 18) {
                newCategory = 'LEVANTE_1';
            }
            else {
                newCategory = 'CRIA';
            }
        }
        else {
            // Machos
            if (goat.weight >= 35) {
                newCategory = 'REPRODUCTOR';
            }
            else if (goat.weight >= 25) {
                newCategory = 'LEVANTE_2';
            }
            else if (goat.weight >= 18) {
                newCategory = 'LEVANTE_1';
            }
            else {
                newCategory = 'CRIA';
            }
        }
        if (newCategory !== goat.category) {
            return await prisma.goat.update({
                where: { id },
                data: { category: newCategory }
            });
        }
        return goat;
    }
}
exports.default = new GoatService();
//# sourceMappingURL=goat.service.js.map