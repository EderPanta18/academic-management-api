// main.ts

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { API_PREFIX } from '@shared/presentation/constants';
import { setupSwagger } from '@shared/presentation/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  app.setGlobalPrefix(API_PREFIX);
  setupSwagger(app);

  await app.listen(port);
}

bootstrap();
