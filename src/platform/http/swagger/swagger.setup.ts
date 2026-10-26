// src/platform/http/swagger/swagger.setup.ts

import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { SwaggerTag } from './swagger.types';

export type SwaggerSetupOptions = {
  title: string;
  description: string;
  version: string;
  path: string;
  accessCookieName: string;
  refreshCookieName: string;
  tags?: readonly SwaggerTag[];
};

export function setupSwagger(app: INestApplication, options: SwaggerSetupOptions): void {
  const builder = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion(options.version)
    .addCookieAuth(options.accessCookieName, undefined, 'accessCookie')
    .addCookieAuth(options.refreshCookieName, undefined, 'refreshCookie');

  for (const tag of options.tags ?? []) builder.addTag(tag.name, tag.description);

  const document = SwaggerModule.createDocument(app, builder.build());

  SwaggerModule.setup(options.path, app, document);
}
