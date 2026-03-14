// app/swagger/swagger.setup.ts

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_TAGS } from '@shared/presentation/constants';
import { API_PREFIX } from '../constants';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Academic Management API')
    .setDescription('API REST para gestión académica universitaria')
    .setVersion('1.0')
    .addTag(SWAGGER_TAGS.PROFESSORS)
    .addTag(SWAGGER_TAGS.STUDENTS)
    .addTag(SWAGGER_TAGS.COURSES)
    .addTag(SWAGGER_TAGS.COURSE_OFFERINGS)
    .addTag(SWAGGER_TAGS.ENROLLMENTS)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${API_PREFIX}/docs`, app, document);
}
