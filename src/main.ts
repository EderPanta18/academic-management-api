// main.ts

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { API_PREFIX } from './app/constants';
import { setupSwagger } from './app/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const port = app.get(ConfigService).getOrThrow<number>('PORT');

  app.setGlobalPrefix(API_PREFIX);
  setupSwagger(app);

  await app.listen(port);
}

bootstrap();
