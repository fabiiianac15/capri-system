const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  try {
    console.log('🔍 Verificando productos...\n');
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        unit: true,
        price: true,
        currentStock: true
      }
    });

    console.log(`Total de productos: ${products.length}\n`);

    const productsWithoutUnit = products.filter(p => !p.unit || p.unit.trim() === '');
    
    if (productsWithoutUnit.length > 0) {
      console.log('⚠️  Productos SIN unidad definida:');
      productsWithoutUnit.forEach(p => {
        console.log(`  - ${p.name} (ID: ${p.id})`);
      });
      console.log('');
    }

    const productsWithUnit = products.filter(p => p.unit && p.unit.trim() !== '');
    
    if (productsWithUnit.length > 0) {
      console.log('✅ Productos CON unidad definida:');
      productsWithUnit.forEach(p => {
        console.log(`  - ${p.name} → ${p.unit}`);
      });
      console.log('');
    }

    // Actualizar productos sin unidad
    if (productsWithoutUnit.length > 0) {
      console.log('🔧 Actualizando productos sin unidad...\n');
      
      for (const product of productsWithoutUnit) {
        await prisma.product.update({
          where: { id: product.id },
          data: { unit: 'unidad' }
        });
        console.log(`✅ ${product.name} → ahora tiene unidad: "unidad"`);
      }
      
      console.log('\n✅ Todos los productos han sido actualizados!');
    } else {
      console.log('✅ Todos los productos ya tienen unidad definida!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
