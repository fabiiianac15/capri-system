import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateStaffData {
  fullName: string;
  dni: string;
  staffType: 'ADMINISTRATIVO' | 'PRACTICANTE';
  salary: number;
  yearsExperience: number;
  specialization?: string;
  academicDegree?: string;
  managerId?: string;
  startDate: Date;
  endDate?: Date;
}

interface UpdateStaffData {
  fullName?: string;
  dni?: string;
  staffType?: 'ADMINISTRATIVO' | 'PRACTICANTE';
  salary?: number;
  yearsExperience?: number;
  specialization?: string;
  academicDegree?: string;
  managerId?: string;
  startDate?: Date;
  endDate?: Date;
}

class StaffService {
  async create(data: CreateStaffData) {
    // Validar que el DNI no exista
    const existing = await prisma.staff.findUnique({
      where: { dni: data.dni }
    });

    if (existing) {
      throw new Error('Ya existe un empleado con ese DNI');
    }

    // Validar que el manager exista si se proporciona
    if (data.managerId) {
      const manager = await prisma.staff.findUnique({
        where: { id: data.managerId }
      });

      if (!manager) {
        throw new Error('El gerente especificado no existe');
      }

      // No permitir que un practicante sea gerente
      if (manager.staffType === 'PRACTICANTE') {
        throw new Error('Un practicante no puede ser gerente');
      }
    }

    const staff = await prisma.staff.create({
      data,
      include: {
        manager: true,
        subordinates: true
      }
    });

    return staff;
  }

  async getAll(filters?: { staffType?: string }) {
    const where: any = {};

    if (filters?.staffType) {
      where.staffType = filters.staffType;
    }

    const staff = await prisma.staff.findMany({
      where,
      include: {
        manager: {
          select: {
            id: true,
            fullName: true,
            dni: true,
            staffType: true
          }
        },
        subordinates: {
          select: {
            id: true,
            fullName: true,
            dni: true,
            staffType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return staff;
  }

  async getById(id: string) {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        manager: true,
        subordinates: true
      }
    });

    if (!staff) {
      throw new Error('Empleado no encontrado');
    }

    return staff;
  }

  async update(id: string, data: UpdateStaffData) {
    const staff = await prisma.staff.findUnique({
      where: { id }
    });

    if (!staff) {
      throw new Error('Empleado no encontrado');
    }

    // Validar DNI único si se está actualizando
    if (data.dni && data.dni !== staff.dni) {
      const existing = await prisma.staff.findUnique({
        where: { dni: data.dni }
      });

      if (existing) {
        throw new Error('Ya existe un empleado con ese DNI');
      }
    }

    // Validar manager si se está actualizando
    if (data.managerId) {
      const manager = await prisma.staff.findUnique({
        where: { id: data.managerId }
      });

      if (!manager) {
        throw new Error('El gerente especificado no existe');
      }

      if (manager.staffType === 'PRACTICANTE') {
        throw new Error('Un practicante no puede ser gerente');
      }
    }

    const updated = await prisma.staff.update({
      where: { id },
      data,
      include: {
        manager: true,
        subordinates: true
      }
    });

    return updated;
  }

  async delete(id: string) {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        subordinates: true
      }
    });

    if (!staff) {
      throw new Error('Empleado no encontrado');
    }

    // Verificar si tiene subordinados
    if (staff.subordinates.length > 0) {
      throw new Error('No se puede eliminar un empleado que tiene subordinados. Reasigne primero.');
    }

    const deleted = await prisma.staff.delete({
      where: { id }
    });

    return deleted;
  }

  async getStats() {
    const [total, byType, avgSalaryByType] = await Promise.all([
      prisma.staff.count(),
      prisma.staff.groupBy({
        by: ['staffType'],
        _count: true
      }),
      prisma.staff.groupBy({
        by: ['staffType'],
        _avg: {
          salary: true
        }
      })
    ]);

    return {
      total,
      byType: byType.map(t => ({
        staffType: t.staffType,
        count: t._count
      })),
      avgSalaryByType: avgSalaryByType.map(t => ({
        staffType: t.staffType,
        avgSalary: t._avg.salary || 0
      }))
    };
  }

  async getManagers() {
    const managers = await prisma.staff.findMany({
      where: {
        staffType: 'ADMINISTRATIVO'
      },
      select: {
        id: true,
        fullName: true,
        dni: true,
        staffType: true
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    return managers;
  }
}

export default new StaffService();
