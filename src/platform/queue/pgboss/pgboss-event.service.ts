import {
  type EventHandle,
  type EventHandler,
  type EventPublishOptions,
  type EventSubscribeOptions,
  type IEventBus,
  type SubscriptionHandle,
} from '@core/contracts';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@platform/config';
import { PgBoss, type WorkHandler, type WorkOptions } from 'pg-boss';
import { QueueRegistry } from './queue-registry';

@Injectable()
export class PgBossEventService implements IEventBus {
  constructor(
    private readonly boss: PgBoss,
    private readonly queues: QueueRegistry,
    private readonly config: AppConfigService,
  ) {}

  async publish<T>(
    eventName: string,
    payload: T,
    options?: EventPublishOptions,
  ): Promise<EventHandle> {
    await this.queues.ensure(eventName);

    await this.boss.publish(eventName, payload as object, {
      startAfter: options?.delay ? new Date(Date.now() + options.delay) : undefined,
      singletonKey: options?.idempotencyKey,
    });

    return {
      eventName,
      publishedAt: new Date(),
    };
  }

  async subscribe<T>(
    eventName: string,
    handler: EventHandler<T>,
    options?: EventSubscribeOptions,
  ): Promise<SubscriptionHandle> {
    await this.queues.ensure(eventName);

    const concurrency = options?.concurrency ?? this.config.queue.event.concurrency;

    const workOptions: WorkOptions = { localConcurrency: concurrency };

    const workHandler: WorkHandler<T> = async (jobs) => {
      for (const job of jobs) await handler(job.data);
    };

    await this.boss.work(eventName, workOptions, workHandler);

    return {
      eventName,
      subscribedAt: new Date(),
    };
  }

  async closeAll(): Promise<void> {
    await this.boss.stop();
  }
}
