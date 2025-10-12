import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de productos...');

  // Obtener proveedores existentes
  const suppliers = await prisma.supplier.findMany();
  
  if (suppliers.length === 0) {
    console.log('⚠️  No hay proveedores. Ejecuta primero seed-locations.ts');
    return;
  }

  // Productos de ejemplo
  const products = [
    {
      name: 'Alimento Concentrado Premium',
      category: 'Alimento',
      description: 'Alimento concentrado balanceado para caprinos',
      currentStock: 500,
      minStock: 100,
      unit: 'kg',
      price: 85000,
      location: 'Bodega A, Estante 1',
      expirationDate: new Date('2025-12-31'),
      supplierId: suppliers[0].id
    },
    {
      name: 'Vitamina B12 Complex',
      category: 'Suplemento',
      description: 'Complejo vitamínico B12 inyectable',
      currentStock: 45,
      minStock: 20,
      unit: 'unidades',
      price: 35000,
      location: 'Bodega A, Estante 2',
      expirationDate: new Date('2025-06-30'),
      supplierId: suppliers[1].id
    },
    {
      name: 'Vacuna Triple',
      category: 'Vacuna',
      description: 'Vacuna triple viral para caprinos',
      currentStock: 80,
      minStock: 30,
      unit: 'dosis',
      price: 12000,
      location: 'Refrigerador 1',
      expirationDate: new Date('2024-08-15'),
      supplierId: suppliers[1].id
    },
    {
      name: 'Antibiótico Penicilina',
      category: 'Medicamento',
      description: 'Penicilina G sódica inyectable',
      currentStock: 25,
      minStock: 15,
      unit: 'frascos',
      price: 45000,
      location: 'Refrigerador 1',
      expirationDate: new Date('2025-03-20'),
      supplierId: suppliers[1].id
    },
    {
      name: 'Desparasitante Oral',
      category: 'Medicamento',
      description: 'Desparasitante de amplio espectro',
      currentStock: 60,
      minStock: 25,
      unit: 'ml',
      price: 28000,
      location: 'Bodega A, Estante 3',
      expirationDate: new Date('2026-01-15'),
      supplierId: suppliers[1].id
    },
    {
      name: 'Suplemento Mineral',
      category: 'Suplemento',
      description: 'Mezcla mineral para caprinos',
      currentStock: 150,
      minStock: 50,
      unit: 'kg',
      price: 55000,
      location: 'Bodega A, Estante 2',
      expirationDate: new Date('2025-11-30'),
      supplierId: suppliers[0].id
    },
    {
      name: 'Jeringa 10ml (Caja x 100)',
      category: 'Equipo',
      description: 'Jeringas desechables estériles 10ml',
      currentStock: 8,
      minStock: 5,
      unit: 'cajas',
      price: 95000,
      location: 'Bodega B, Estante 1',
      expirationDate: null,
      supplierId: suppliers[2].id
    },
    {
      name: 'Termómetro Digital',
      category: 'Equipo',
      description: 'Termómetro digital veterinario',
      currentStock: 12,
      minStock: 5,
      unit: 'unidades',
      price: 65000,
      location: 'Bodega B, Estante 2',
      expirationDate: null,
      supplierId: suppliers[2].id
    },
    {
      name: 'Heno de Alfalfa (Paca)',
      category: 'Alimento',
      description: 'Heno de alfalfa premium en pacas',
      currentStock: 30,
      minStock: 15,
      unit: 'pacas',
      price: 45000,
      location: 'Bodega C',
      expirationDate: new Date('2024-06-30'),
      supplierId: suppliers[0].id
    },
    {
      name: 'Sal Mineralizada',
      category: 'Suplemento',
      description: 'Sal con minerales esenciales',
      currentStock: 200,
      minStock: 80,
      unit: 'kg',
      price: 25000,
      location: 'Bodega A, Estante 4',
      expirationDate: null,
      supplierId: suppliers[0].id
    }
  ];

  let created = 0;
  for (const productData of products) {
    const existing = await prisma.product.findFirst({
      where: { name: productData.name }
    });

    if (!existing) {
      await prisma.product.create({ data: productData });
      created++;
      console.log(`✅ Producto creado: ${productData.name}`);
    } else {
      console.log(`⏭️  Producto ya existe: ${productData.name}`);
    }
  }

  console.log(`\n🎉 Seed de productos completado!`);
  console.log(`📦 Productos creados: ${created}`);
  console.log(`📊 Total en base de datos: ${await prisma.product.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
