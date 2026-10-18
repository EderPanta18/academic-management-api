// src/worker.ts

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { registerJobs } from './workers';

async function bootstrapWorker(): Promise<void> {
  const logger = new Logger('WorkerBootstrap');

  // Creamos el contexto de la aplicación (sin servidor HTTP)
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Registramos los procesadores de las colas
  await registerJobs(app);

  logger.log('Worker de procesamiento asíncrono iniciado correctamente.');

  // Manejo de cierre limpio (Graceful Shutdown)
  const shutdown = async (signal: string) => {
    logger.log(`Recibida señal ${signal}. Cerrando worker...`);

    await app.close();

    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrapWorker().catch((error) => {
  console.error('Error fatal al iniciar el worker:', error);

  process.exit(1);
});
