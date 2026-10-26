// src/platform/queue/queue.module.ts

import { EVENT_BUS_TOKEN, JOB_QUEUE_TOKEN } from '@core/contracts';
import { Module, type OnModuleDestroy } from '@nestjs/common';
import { PgBoss } from 'pg-boss';
import { PgBossEventService, PgBossJobService, pgbossProvider, QueueRegistry } from './pgboss';

@Module({
  providers: [
    pgbossProvider,
    QueueRegistry,
    {
      provide: JOB_QUEUE_TOKEN,
      useClass: PgBossJobService,
    },
    {
      provide: EVENT_BUS_TOKEN,
      useClass: PgBossEventService,
    },
  ],
  exports: [JOB_QUEUE_TOKEN, EVENT_BUS_TOKEN],
})
export class QueueModule implements OnModuleDestroy {
  constructor(private readonly boss: PgBoss) {}

  async onModuleDestroy(): Promise<void> {
    await this.boss.stop();
  }
}
