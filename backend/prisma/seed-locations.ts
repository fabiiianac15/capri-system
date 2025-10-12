import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Iniciando seed de ubicaciones...');

  // Crear Colombia
  const colombia = await prisma.country.upsert({
    where: { code: 'CO' },
    update: {},
    create: {
      name: 'Colombia',
      code: 'CO'
    }
  });

  console.log('✅ País creado:', colombia.name);

  // Crear departamentos de Colombia
  const antioquia = await prisma.state.upsert({
    where: { countryId_name: { countryId: colombia.id, name: 'Antioquia' } },
    update: {},
    create: {
      name: 'Antioquia',
      countryId: colombia.id
    }
  });

  const cundinamarca = await prisma.state.upsert({
    where: { countryId_name: { countryId: colombia.id, name: 'Cundinamarca' } },
    update: {},
    create: {
      name: 'Cundinamarca',
      countryId: colombia.id
    }
  });

  const valle = await prisma.state.upsert({
    where: { countryId_name: { countryId: colombia.id, name: 'Valle del Cauca' } },
    update: {},
    create: {
      name: 'Valle del Cauca',
      countryId: colombia.id
    }
  });

  const santander = await prisma.state.upsert({
    where: { countryId_name: { countryId: colombia.id, name: 'Santander' } },
    update: {},
    create: {
      name: 'Santander',
      countryId: colombia.id
    }
  });

  console.log('✅ Departamentos creados: 4');

  // Crear ciudades de Antioquia
  await prisma.city.upsert({
    where: { stateId_name: { stateId: antioquia.id, name: 'Medellín' } },
    update: {},
    create: { name: 'Medellín', stateId: antioquia.id }
  });

  await prisma.city.upsert({
    where: { stateId_name: { stateId: antioquia.id, name: 'Envigado' } },
    update: {},
    create: { name: 'Envigado', stateId: antioquia.id }
  });

  await prisma.city.upsert({
    where: { stateId_name: { stateId: antioquia.id, name: 'Bello' } },
    update: {},
    create: { name: 'Bello', stateId: antioquia.id }
  });

  await prisma.city.upsert({
    where: { stateId_name: { stateId: antioquia.id, name: 'Rionegro' } },
    update: {},
    create: { name: 'Rionegro', stateId: antioquia.id }
  });

  // Crear ciudades de Cundinamarca
  await prisma.city.upsert({
    where: { stateId_name: { stateId: cundinamarca.id, name: 'Bogotá' } },
    update: {},
    create: { name: 'Bogotá', stateId: cundinamarca.id }
  });

  await prisma.city.upsert({
    where: { stateId_name: { stateId: cundinamarca.id, name: 'Soacha' } },
    update: {},
    create: { name: 'Soacha', stateId: cundinamarca.id }
  });

  await prisma.city.upsert({
    where: { stateId_name: { stateId: cundinamarca.id, name: 'Chía' } },
    update: {},
    create: { name: 'Chía', stateId: cundinamarca.id }
  });

  // Crear ciudades de Valle del Cauca
  await prisma.city.upsert({
    where: { stateId_name: { stateId: valle.id, name: 'Cali' } },
    update: {},
    create: { name: 'Cali', stateId: valle.id }
  });

  await prisma.city.upsert({
    where: { stateId_name: { stateId: valle.id, name: 'Palmira' } },
    update: {},
    create: { name: 'Palmira', stateId: valle.id }
  });

  await prisma.city.upsert({
    where: { stateId_name: { stateId: valle.id, name: 'Yumbo' } },
    update: {},
    create: { name: 'Yumbo', stateId: valle.id }
  });

  // Crear ciudades de Santander
  await prisma.city.upsert({
    where: { stateId_name: { stateId: santander.id, name: 'Bucaramanga' } },
    update: {},
    create: { name: 'Bucaramanga', stateId: santander.id }
  });

  await prisma.city.upsert({
    where: { stateId_name: { stateId: santander.id, name: 'Floridablanca' } },
    update: {},
    create: { name: 'Floridablanca', stateId: santander.id }
  });

  await prisma.city.upsert({
    where: { stateId_name: { stateId: santander.id, name: 'Girón' } },
    update: {},
    create: { name: 'Girón', stateId: santander.id }
  });

  console.log('✅ Ciudades creadas: 13');

  // Crear proveedores de ejemplo
  const medellinCity = await prisma.city.findFirst({
    where: { name: 'Medellín' }
  });

  const bogotaCity = await prisma.city.findFirst({
    where: { name: 'Bogotá' }
  });

  if (medellinCity) {
    await prisma.supplier.upsert({
      where: { nit: '900123456-7' },
      update: {},
      create: {
        name: 'Agroinsumos del Valle S.A.S',
        nit: '900123456-7',
        phone: '+57 4 444 5555',
        email: 'contacto@agroinsumos.com',
        address: 'Calle 50 # 45-23',
        cityId: medellinCity.id,
        description: 'Distribuidor de alimentos balanceados y suplementos'
      }
    });

    await prisma.supplier.upsert({
      where: { nit: '900234567-8' },
      update: {},
      create: {
        name: 'Veterinaria La Esperanza',
        nit: '900234567-8',
        phone: '+57 4 555 6666',
        email: 'ventas@veterinariaesperanza.com',
        address: 'Carrera 70 # 34-12',
        cityId: medellinCity.id,
        description: 'Medicamentos veterinarios y productos de cuidado animal'
      }
    });
  }

  if (bogotaCity) {
    await prisma.supplier.upsert({
      where: { nit: '900345678-9' },
      update: {},
      create: {
        name: 'Suplementos Ganaderos S.A',
        nit: '900345678-9',
        phone: '+57 1 777 8888',
        email: 'info@suplementosganaderos.com',
        address: 'Avenida 68 # 23-45',
        cityId: bogotaCity.id,
        description: 'Suplementos nutricionales para ganado caprino'
      }
    });
  }

  console.log('✅ Proveedores de ejemplo creados: 3');

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
