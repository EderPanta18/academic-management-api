// app/app.bootstrap.ts

import type { INestApplication } from '@nestjs/common';

import { RuntimeConfigService } from '@platform/config';
import { setupSwagger } from '@platform/http';
import { APP_CONFIG, SWAGGER_TAGS } from './app.config';

export function bootstrapApp(app: INestApplication): void {
  const config = app.get(RuntimeConfigService);

  app.enableCors({
    credentials: true,
    origin: config.corsOrigins,
  });

  app.setGlobalPrefix(APP_CONFIG.apiPrefix);

  setupSwagger(app, {
    description: APP_CONFIG.description,
    path: `${APP_CONFIG.apiPrefix}/${APP_CONFIG.docsPath}`,
    title: APP_CONFIG.name,
    version: APP_CONFIG.version,
    tags: SWAGGER_TAGS,
  });
}
