// main.ts

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  API_PREFIX,
  AllExceptionsFilter,
  DomainExceptionFilter,
  LoggingInterceptor,
  ResponseWrapperInterceptor,
  ValidationPipe,
} from '@shared/presentation';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ConfigService disponible una vez que el AppModule está inicializado
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalFilters(
    new AllExceptionsFilter(), // red de seguridad, actúa de último
    new DomainExceptionFilter(), // actúa primero, captura DomainException
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseWrapperInterceptor(),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
