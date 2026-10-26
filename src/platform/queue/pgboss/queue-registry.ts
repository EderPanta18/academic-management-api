// src/platform/queue/pgboss/queue-registry.ts

import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@platform/config';
import { PgBoss } from 'pg-boss';

type QueueSettings = {
  retryLimit: number;
  retryDelay: number;
  retryBackoff: boolean;
  expireInSeconds: number;
  deleteAfterSeconds: number;
};

@Injectable()
export class QueueRegistry {
  private readonly known = new Set<string>();
  private readonly inFlight = new Map<string, Promise<void>>();

  constructor(
    private readonly boss: PgBoss,
    private readonly config: ConfigService,
  ) {}

  async ensure(name: string): Promise<void> {
    if (this.known.has(name)) return;

    const pending = this.inFlight.get(name);

    if (pending) {
      await pending;

      return;
    }

    const operation = this.createIfNeeded(name)
      .then(() => {
        this.known.add(name);
      })
      .finally(() => {
        this.inFlight.delete(name);
      });

    this.inFlight.set(name, operation);

    await operation;
  }

  private async createIfNeeded(name: string): Promise<void> {
    const queue = this.config.queue;

    const settings: QueueSettings = {
      retryLimit: queue.retryLimit,
      retryDelay: queue.retryDelayMs / 1_000,
      retryBackoff: queue.retryBackoff,
      expireInSeconds: queue.expireInMinutes * 60,
      deleteAfterSeconds: queue.archiveCompletedAfterDays * 86_400,
    };

    if (
      !Number.isSafeInteger(settings.retryLimit) ||
      settings.retryLimit < 0 ||
      !Number.isSafeInteger(settings.retryDelay) ||
      settings.retryDelay < 0 ||
      !Number.isSafeInteger(settings.expireInSeconds) ||
      settings.expireInSeconds < 1 ||
      settings.expireInSeconds > 86_400 ||
      !Number.isSafeInteger(settings.deleteAfterSeconds) ||
      settings.deleteAfterSeconds < 0
    )
      throw new SystemException('La configuración de la cola PgBoss es inválida.');

    const existing = await this.boss.getQueue(name);

    if (existing) {
      this.assertConfiguration(name, existing, settings);

      return;
    }

    try {
      await this.boss.createQueue(name, settings);
    } catch (error) {
      const created = await this.boss.getQueue(name);

      if (!created) throw error;

      this.assertConfiguration(name, created, settings);
    }
  }

  private assertConfiguration(
    name: string,
    actual: NonNullable<Awaited<ReturnType<PgBoss['getQueue']>>>,
    expected: QueueSettings,
  ): void {
    if (
      actual.retryLimit !== expected.retryLimit ||
      actual.retryDelay !== expected.retryDelay ||
      actual.retryBackoff !== expected.retryBackoff ||
      actual.expireInSeconds !== expected.expireInSeconds ||
      actual.deleteAfterSeconds !== expected.deleteAfterSeconds
    )
      throw new SystemException(
        `La cola "${name}" tiene una configuración diferente de la requerida.`,
      );
  }
}
