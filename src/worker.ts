// src/worker.ts

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { registerJobs } from './workers/register-jobs';
import { WorkerModule } from './workers/worker.module';

async function bootstrapWorker(): Promise<void> {
  const logger = new Logger('WorkerBootstrap');

  // Creamos el contexto usando el WorkerModule (SIN HTTP)
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Habilitamos el cierre limpio nativo de NestJS
  // Esto llamará a onModuleDestroy de Prisma, PgBoss, etc.
  app.enableShutdownHooks();

  // Registramos los procesadores
  await registerJobs(app);

  logger.log('Worker de procesamiento asíncrono iniciado correctamente.');
}

bootstrapWorker().catch((error) => {
  console.error('Error fatal al iniciar el worker:', error);
  process.exit(1);
});
