import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ========================================
// TYPES
// ========================================
export interface CreateMedicamentoDTO {
  nombre: string;
  tipo: string;
  descripcion?: string;
  dosis: string;
  viaAdministracion: string;
  fabricante?: string;
  lote?: string;
  fechaVencimiento?: string;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: string;
  precioUnitario?: number;
  ubicacionAlmacen?: string;
  condicionesAlmacenamiento?: string;
  notas?: string;
}

export interface UpdateMedicamentoDTO extends Partial<CreateMedicamentoDTO> {
  activo?: boolean;
}

export interface AlertaMedicamento {
  tipo: 'VENCIMIENTO' | 'STOCK_BAJO' | 'STOCK_CRITICO';
  medicamento: any;
  mensaje: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
}

// ========================================
// SERVICE
// ========================================
class MedicamentoService {
  
  // Crear medicamento
  async create(data: CreateMedicamentoDTO) {
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
        createdById: (data as any).createdById,
      } as any,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      } as any
    });
  }

  // Obtener todos los medicamentos
  async getAll(filters?: { tipo?: string; activo?: boolean }) {
    const where: any = {};
    
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
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      } as any,
      orderBy: [
        { activo: 'desc' },
        { nombre: 'asc' },
      ],
    });
  }

  // Obtener por ID
  async getById(id: string) {
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
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      } as any,
    });
  }

  // Actualizar medicamento
  async update(id: string, data: UpdateMedicamentoDTO) {
    const updateData: any = {};

    Object.keys(data).forEach(key => {
      if (data[key as keyof UpdateMedicamentoDTO] !== undefined) {
        if (key === 'fechaVencimiento' && data[key]) {
          updateData[key] = new Date(data[key] as string);
        } else {
          updateData[key] = data[key as keyof UpdateMedicamentoDTO];
        }
      }
    });

    return await prisma.medicamento.update({
      where: { id },
      data: updateData,
    });
  }

  // Actualizar stock
  async updateStock(id: string, cantidad: number, operacion: 'INCREMENTAR' | 'DECREMENTAR') {
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
  async delete(id: string) {
    return await prisma.medicamento.update({
      where: { id },
      data: { activo: false },
    });
  }

  // Eliminar permanentemente
  async hardDelete(id: string) {
    return await prisma.medicamento.delete({
      where: { id },
    });
  }

  // Obtener alertas (vencimientos y stock bajo)
  async getAlertas(): Promise<AlertaMedicamento[]> {
    const medicamentos = await prisma.medicamento.findMany({
      where: { activo: true },
    });

    const alertas: AlertaMedicamento[] = [];
    const hoy = new Date();

    medicamentos.forEach(med => {
      // Alerta de vencimiento
      if (med.fechaVencimiento) {
        const diasParaVencer = Math.ceil(
          (med.fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diasParaVencer <= 0) {
          alertas.push({
            tipo: 'VENCIMIENTO',
            medicamento: med,
            mensaje: `${med.nombre} está VENCIDO`,
            prioridad: 'ALTA',
          });
        } else if (diasParaVencer <= 15) {
          alertas.push({
            tipo: 'VENCIMIENTO',
            medicamento: med,
            mensaje: `${med.nombre} vence en ${diasParaVencer} días`,
            prioridad: 'ALTA',
          });
        } else if (diasParaVencer <= 30) {
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
      } else if (med.stockActual <= med.stockMinimo * 0.5) {
        alertas.push({
          tipo: 'STOCK_CRITICO',
          medicamento: med,
          mensaje: `${med.nombre} - Stock crítico: ${med.stockActual} ${med.unidadMedida}`,
          prioridad: 'ALTA',
        });
      } else if (med.stockActual <= med.stockMinimo) {
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
    }, {} as Record<string, number>);

    const stockBajo = medicamentos.filter(m => m.stockActual <= m.stockMinimo).length;
    const porVencer = medicamentos.filter(m => {
      if (!m.fechaVencimiento) return false;
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

export default new MedicamentoService();
