import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedStaff() {
  console.log('🌱 Seeding staff...');

  // Crear gerente administrativo
  const manager = await prisma.staff.create({
    data: {
      fullName: 'María González Pérez',
      dni: '1234567890',
      staffType: 'ADMINISTRATIVO',
      salary: 3500000,
      yearsExperience: 8,
      specialization: 'Administración Agropecuaria',
      academicDegree: 'Ingeniera Agrónoma',
      startDate: new Date('2020-01-15')
    }
  });

  console.log('✅ Manager created:', manager.fullName);

  // Crear empleados subordinados
  const staff1 = await prisma.staff.create({
    data: {
      fullName: 'Carlos Andrés Ramírez',
      dni: '9876543210',
      staffType: 'ADMINISTRATIVO',
      salary: 2800000,
      yearsExperience: 5,
      specialization: 'Producción Animal',
      academicDegree: 'Zootecnista',
      managerId: manager.id,
      startDate: new Date('2021-03-01')
    }
  });

  console.log('✅ Staff member created:', staff1.fullName);

  const staff2 = await prisma.staff.create({
    data: {
      fullName: 'Laura Patricia Sánchez',
      dni: '5555555555',
      staffType: 'PRACTICANTE',
      salary: 1500000,
      yearsExperience: 1,
      specialization: 'Veterinaria',
      academicDegree: 'Estudiante de Veterinaria',
      managerId: manager.id,
      startDate: new Date('2024-06-01')
    }
  });

  console.log('✅ Staff member created:', staff2.fullName);

  const staff3 = await prisma.staff.create({
    data: {
      fullName: 'Juan Pablo Martínez',
      dni: '3333333333',
      staffType: 'PRACTICANTE',
      salary: 1500000,
      yearsExperience: 0,
      academicDegree: 'Técnico Agropecuario',
      managerId: manager.id,
      startDate: new Date('2024-08-15')
    }
  });

  console.log('✅ Staff member created:', staff3.fullName);

  console.log('✅ Staff seeding completed!');
  console.log(`📊 Total staff: ${await prisma.staff.count()}`);
}

seedStaff()
  .catch((e) => {
    console.error('❌ Error seeding staff:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
