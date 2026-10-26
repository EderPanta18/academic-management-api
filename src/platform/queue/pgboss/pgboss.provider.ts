// src/platform/queue/pgboss/pgboss.provider.ts

import type { Provider } from '@nestjs/common';
import { ConfigService } from '@platform/config';
import { PgBoss } from 'pg-boss';

export const pgbossProvider: Provider = {
  provide: PgBoss,
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<PgBoss> => {
    const boss = new PgBoss({
      connectionString: config.database.url,
      schema: config.queue.schema,
    });

    await boss.start();

    return boss;
  },
};
