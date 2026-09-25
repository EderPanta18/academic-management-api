import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@platform/config';
import { PgBoss } from 'pg-boss';

@Injectable()
export class QueueRegistry {
  private readonly known = new Set<string>();
  private readonly inFlight = new Map<string, Promise<void>>();

  constructor(
    private readonly boss: PgBoss,
    private readonly config: AppConfigService,
  ) {}

  async ensure(name: string): Promise<void> {
    if (this.known.has(name)) return;

    const existing = this.inFlight.get(name);

    if (existing) return existing;

    const promise = this.createIfNeeded(name).finally(() => {
      this.inFlight.delete(name);
    });

    this.inFlight.set(name, promise);
    await promise;

    this.known.add(name);
  }

  private async createIfNeeded(name: string): Promise<void> {
    const found = await this.boss.getQueue(name);

    if (found) return;

    const queueConfig = this.config.queue;

    await this.boss.createQueue(name, {
      retryLimit: queueConfig.retryLimit,
      retryDelay: queueConfig.retryDelayMs / 1000,
      retryBackoff: queueConfig.retryBackoff,
      expireInSeconds: queueConfig.expireInMinutes * 60,
      deleteAfterSeconds: queueConfig.archiveCompletedAfterDays * 86400,
    });
  }

  clear(): void {
    this.known.clear();
    this.inFlight.clear();
  }
}
