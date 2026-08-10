// app/app.bootstrap.ts

import { type INestApplication, Logger } from '@nestjs/common';
import { AppConfigService } from '@platform/config';
import { setupHttp } from '@platform/http';
import { SWAGGER_TAGS } from './app.config';

export async function bootstrapApp(app: INestApplication): Promise<void> {
  const logger = new Logger('Bootstrap');

  const config = app.get(AppConfigService);

  setupHttp(app, config, {
    swaggerTags: SWAGGER_TAGS,
  });

  await app.listen(config.port);

  logger.log(`Servidor ejecutándose en puerto ${config.port} en modo ${config.nodeEnv}`);
}
