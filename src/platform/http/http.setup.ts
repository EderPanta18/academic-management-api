// src/platform/http/http.setup.ts

import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@platform/config';
import { type SwaggerTag, setupSwagger } from './swagger';

export type HttpSetupOptions = {
  swaggerTags?: readonly SwaggerTag[];
};

export function setupHttp(
  app: INestApplication,
  config: ConfigService,
  options: HttpSetupOptions = {},
): void {
  app.enableCors({
    origin: config.cors.origins,
    credentials: config.cors.credentials,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix(config.apiPrefix);

  if (!config.openapi.enabled) return;

  setupSwagger(app, {
    title: config.app.name,
    description: config.app.description,
    version: config.app.version,
    path: config.openapi.path,
    accessCookieName: config.jwt.access.name,
    refreshCookieName: config.jwt.refresh.name,
    tags: options.swaggerTags,
  });
}
