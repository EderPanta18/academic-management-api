// platform/http/http-setup.ts

import type { INestApplication } from '@nestjs/common';
import { AppConfigService } from '@platform/config';
import { type SwaggerTag, setupSwagger } from './swagger';

export interface HttpSetupOptions {
  swaggerTags?: readonly SwaggerTag[];
}

export function setupHttp(
  app: INestApplication,
  config: AppConfigService,
  options: HttpSetupOptions = {},
): void {
  const { app: appConfig, cors: corsConfig, openapi: openapiConfig } = config;

  app.enableCors({
    origin: corsConfig.origins,
    credentials: corsConfig.credentials,
  });

  app.setGlobalPrefix(appConfig.apiPrefix);

  if (!openapiConfig.enabled) return;

  setupSwagger(app, {
    title: appConfig.name,
    description: appConfig.description,
    version: appConfig.version,
    path: openapiConfig.path,
    tags: options.swaggerTags,
  });
}
