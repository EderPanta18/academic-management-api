// prisma/seed.ts

import { prisma } from './client';
import { seedAcademicStructure, seedBaseTables, seedEnrollments } from './seeds';

async function main() {
  console.log('\n------ INICIANDO POBLADO DE BASE DE DATOS ------');

  try {
    await prisma.connect();

    const baseMaps = await seedBaseTables(prisma);
    const academicMaps = await seedAcademicStructure(prisma, baseMaps);

    await seedEnrollments(prisma, academicMaps);

    console.log('\n¡Poblado de base de datos completado exitosamente!');
  } catch (error) {
    console.error('\nError durante el poblado:', error);
    process.exit(1);
  } finally {
    console.log('\nDesconectando DB ....');

    await prisma.disconnect();
  }
}

main().catch((error) => {
  console.error('\nError fatal:', error);
  process.exit(1);
});
