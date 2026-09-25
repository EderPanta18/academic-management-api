import type { Provider } from '@nestjs/common';
import { AppConfigService } from '@platform/config';
import { PgBoss } from 'pg-boss';

export const pgbossProvider: Provider = {
  provide: PgBoss,
  inject: [AppConfigService],
  useFactory: async (config: AppConfigService): Promise<PgBoss> => {
    const { database, queue } = config;

    const boss = new PgBoss({
      connectionString: database.url,
      schema: queue.schema,
    });

    await boss.start();

    return boss;
  },
};
