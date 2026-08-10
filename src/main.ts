// main.ts

import { AppModule, bootstrapApp } from '@app';
import { NestFactory } from '@nestjs/core';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  bootstrapApp(app);
}

bootstrap();
