import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productService = {
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

  async getById(id: string) {
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

  async create(data: {
    name: string;
    category: string;
    description?: string;
    currentStock: number;
    minStock: number;
    unit: string;
    price: number;
    supplierId?: string;
    location?: string;
    expirationDate?: Date;
  }) {
    return await prisma.product.create({
      data,
      include: {
        supplier: true
      }
    });
  },

  async update(id: string, data: {
    name?: string;
    category?: string;
    description?: string;
    currentStock?: number;
    minStock?: number;
    unit?: string;
    price?: number;
    supplierId?: string;
    location?: string;
    expirationDate?: Date;
  }) {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        supplier: true
      }
    });
  },

  async delete(id: string) {
    return await prisma.product.delete({
      where: { id }
    });
  },

  async createOutput(data: {
    productId: string;
    userId: string;
    quantity: number;
    notes?: string;
  }) {
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

  async getOutputs(productId: string) {
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
