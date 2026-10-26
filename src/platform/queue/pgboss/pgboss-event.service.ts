// src/platform/queue/pgboss/pgboss-event.service.ts

import type {
  EventHandler,
  EventPublishOptions,
  EventPublishResult,
  EventSubscribeOptions,
  IEventBus,
  SubscriptionHandle,
} from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@platform/config';
import { PgBoss, type WorkHandler } from 'pg-boss';
import { QueueRegistry } from './queue-registry';

type EventEnvelope<T> = {
  payload: T;
};

@Injectable()
export class PgBossEventService implements IEventBus {
  private readonly subscriptions = new Set<string>();

  constructor(
    private readonly boss: PgBoss,
    private readonly queues: QueueRegistry,
    private readonly config: ConfigService,
  ) {}

  async publish<T>(
    eventName: string,
    payload: T,
    options?: EventPublishOptions,
  ): Promise<EventPublishResult> {
    if (options?.idempotencyKey !== undefined)
      throw new SystemException(
        'No se puede garantizar publicación idempotente por destinatario con PgBoss.publish().',
      );

    if (
      options?.delayMs !== undefined &&
      (!Number.isSafeInteger(options.delayMs) ||
        options.delayMs < 0 ||
        Math.abs(Date.now() + options.delayMs) > 8_640_000_000_000_000)
    )
      throw new SystemException('delayMs debe representar un retraso válido.');

    await this.boss.publish(
      eventName,
      { payload },
      {
        startAfter: options?.delayMs ? new Date(Date.now() + options.delayMs) : undefined,
      },
    );

    return { status: 'accepted' };
  }

  async subscribe<T>(
    eventName: string,
    handler: EventHandler<T>,
    options?: EventSubscribeOptions,
  ): Promise<SubscriptionHandle> {
    if (this.subscriptions.has(eventName))
      throw new SystemException(`El evento "${eventName}" ya tiene un consumidor local.`);

    const concurrency = options?.concurrency ?? this.config.queue.event.concurrency;

    if (!Number.isSafeInteger(concurrency) || concurrency < 1)
      throw new SystemException(
        'La concurrencia del consumidor de eventos debe ser un entero positivo.',
      );

    this.subscriptions.add(eventName);

    try {
      const queueName = `events.${eventName}`;

      await this.queues.ensure(queueName);
      await this.boss.subscribe(eventName, queueName);

      const workHandler: WorkHandler<EventEnvelope<T>> = async (jobs) => {
        for (const job of jobs) await handler(job.data.payload);
      };

      const workerId = await this.boss.work(
        queueName,
        {
          localConcurrency: concurrency,
          batchSize: 1,
        },
        workHandler,
      );

      let stopPromise: Promise<void> | undefined;

      return {
        unsubscribe: (): Promise<void> => {
          stopPromise ??= this.boss
            .offWork(queueName, {
              id: workerId,
              wait: true,
            })
            .then(() => {
              this.subscriptions.delete(eventName);
            })
            .catch((error: unknown) => {
              stopPromise = undefined;
              throw error;
            });

          return stopPromise;
        },
      };
    } catch (error) {
      this.subscriptions.delete(eventName);

      throw error;
    }
  }
}
