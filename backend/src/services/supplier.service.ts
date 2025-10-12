import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const supplierService = {
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

  async getById(id: string) {
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

  async create(data: {
    name: string;
    nit?: string;
    phone?: string;
    email?: string;
    address?: string;
    cityId?: string;
  }) {
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

  async update(id: string, data: {
    name?: string;
    nit?: string;
    phone?: string;
    email?: string;
    address?: string;
    cityId?: string;
  }) {
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

  async delete(id: string) {
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

  async getStatesByCountry(countryId: string) {
    return await prisma.state.findMany({
      where: { countryId },
      orderBy: { name: 'asc' }
    });
  },

  async getCitiesByState(stateId: string) {
    return await prisma.city.findMany({
      where: { stateId },
      orderBy: { name: 'asc' }
    });
  }
};
