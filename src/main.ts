// main.ts

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_PREFIX } from '@shared/presentation/constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  app.setGlobalPrefix(API_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Academic Management API')
    .setDescription('API REST para gestión académica universitaria')
    .setVersion('1.0')
    .addTag('health')
    .addTag('professors')
    .addTag('students')
    .addTag('courses')
    .addTag('enrollments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}
bootstrap();
