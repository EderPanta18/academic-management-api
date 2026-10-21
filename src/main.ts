// main.ts

import { AppModule, bootstrapApp } from '@app';
import { NestFactory } from '@nestjs/core';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  await bootstrapApp(app);
}

bootstrap().catch((error) => {
  console.error('Error fatal durante el arranque de la API:', error);

  process.exit(1);
});
