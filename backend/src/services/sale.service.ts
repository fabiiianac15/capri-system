import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ProductType = 'CARNE' | 'LECHE' | 'CABRA_VIVA' | 'PRODUCTO_ELABORADO';
type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';

interface CreateSaleData {
  productType: ProductType;
  customerName: string;
  customerId?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
  userId: string;
  goatId?: string;
  notes?: string;
  saleDate?: Date;
}

interface UpdateSaleData {
  productType?: ProductType;
  customerName?: string;
  customerId?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  totalPrice?: number;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
  goatId?: string;
  notes?: string;
  saleDate?: Date;
}

class SaleService {
  async create(data: CreateSaleData) {
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

    // Determinar automáticamente el paymentStatus basado en amountPaid
    const amountPaid = data.amountPaid ?? 0;
    let paymentStatus: PaymentStatus = data.paymentStatus || 'PENDING';
    
    if (amountPaid >= data.totalPrice) {
      paymentStatus = 'PAID';
    } else if (amountPaid > 0 && amountPaid < data.totalPrice) {
      paymentStatus = 'PARTIAL';
    } else {
      paymentStatus = 'PENDING';
    }

    const sale = await prisma.sale.create({
      data: {
        ...data,
        amountPaid,
        paymentStatus,
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

  async getAll(filters?: { 
    productType?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};

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

  async getById(id: string) {
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

  async update(id: string, data: UpdateSaleData) {
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

    // Determinar automáticamente el paymentStatus basado en amountPaid
    const totalPrice = data.totalPrice ?? sale.totalPrice;
    const amountPaid = data.amountPaid ?? (sale as any).amountPaid ?? 0;
    let paymentStatus = data.paymentStatus;
    
    // Solo recalcular si no se especifica paymentStatus explícitamente
    if (!paymentStatus && data.amountPaid !== undefined) {
      if (amountPaid >= totalPrice) {
        paymentStatus = 'PAID';
      } else if (amountPaid > 0 && amountPaid < totalPrice) {
        paymentStatus = 'PARTIAL';
      } else {
        paymentStatus = 'PENDING';
      }
    }

    const updated = await prisma.sale.update({
      where: { id },
      data: {
        ...data,
        ...(paymentStatus && { paymentStatus })
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

    return updated;
  }

  async delete(id: string) {
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
    // Obtener todas las ventas para calcular correctamente
    const allSales = await prisma.sale.findMany({
      select: {
        productType: true,
        paymentStatus: true,
        totalPrice: true,
        amountPaid: true
      }
    }) as any[];

    const total = allSales.length;

    // Calcular ingresos reales (suma de amountPaid)
    const totalRevenue = allSales.reduce((sum, sale) => sum + (sale.amountPaid || 0), 0);

    // Calcular pagos pendientes (suma de lo que falta por pagar)
    const pendingPayments = allSales
      .filter(sale => sale.paymentStatus === 'PENDING' || sale.paymentStatus === 'PARTIAL')
      .reduce((sum, sale) => sum + (sale.totalPrice - (sale.amountPaid || 0)), 0);

    // Agrupar por tipo de producto
    const byProductType = allSales.reduce((acc, sale) => {
      const existing = acc.find((item: any) => item.productType === sale.productType);
      if (existing) {
        existing.count++;
        existing.revenue += (sale.amountPaid || 0);
      } else {
        acc.push({
          productType: sale.productType,
          count: 1,
          revenue: sale.amountPaid || 0
        });
      }
      return acc;
    }, [] as { productType: string; count: number; revenue: number }[]);

    // Agrupar por estado de pago
    const byPaymentStatus = allSales.reduce((acc, sale) => {
      const existing = acc.find((item: any) => item.paymentStatus === sale.paymentStatus);
      if (existing) {
        existing.count++;
      } else {
        acc.push({
          paymentStatus: sale.paymentStatus,
          count: 1
        });
      }
      return acc;
    }, [] as { paymentStatus: string; count: number }[]);

    // Promedio del valor total de ventas (no confundir con lo pagado)
    const avgSaleValue = total > 0 
      ? allSales.reduce((sum, sale) => sum + sale.totalPrice, 0) / total
      : 0;

    return {
      total,
      byProductType,
      byPaymentStatus,
      totalRevenue, // Suma de lo realmente pagado (amountPaid)
      avgSaleValue,
      pendingPayments // Suma de lo que falta por pagar
    };
  }
}

export default new SaleService();
