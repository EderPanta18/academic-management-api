// platform/http/swagger/swagger-setup.ts

import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { SwaggerTag } from './swagger.types';

export interface SwaggerSetupOptions {
  title: string;
  description: string;
  version: string;
  path: string;
  tags?: readonly SwaggerTag[];
}

export function setupSwagger(app: INestApplication, options: SwaggerSetupOptions): void {
  const builder = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion(options.version);

  options.tags?.forEach((tag) => {
    builder.addTag(tag.name, tag.description);
  });

  const config = builder.build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(options.path, app, document);
}
