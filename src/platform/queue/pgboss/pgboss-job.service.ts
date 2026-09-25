import {
  type IJobQueue,
  type JobEnqueueOptions,
  type JobHandle,
  type JobProcessOptions,
  type JobProcessor,
  type JobProcessorHandle,
} from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@platform/config';
import { PgBoss, type WorkHandler, type WorkOptions } from 'pg-boss';
import { QueueRegistry } from './queue-registry';

@Injectable()
export class PgBossJobService implements IJobQueue {
  constructor(
    private readonly boss: PgBoss,
    private readonly queues: QueueRegistry,
    private readonly config: AppConfigService,
  ) {}

  async enqueue<T>(jobName: string, payload: T, options?: JobEnqueueOptions): Promise<JobHandle> {
    await this.queues.ensure(jobName);

    const id = await this.boss.send(jobName, payload as object, {
      priority: options?.priority,
      startAfter: options?.delay ? new Date(Date.now() + options.delay) : undefined,
      retryLimit: options?.attempts,
      id: options?.jobId,
    });

    if (!id) throw new SystemException('PgBoss no devolvió un id al encolar un job.');

    return {
      id,
      jobName,
      enqueuedAt: new Date(),
    };
  }

  async process<T>(
    jobName: string,
    processor: JobProcessor<T>,
    options?: JobProcessOptions,
  ): Promise<JobProcessorHandle> {
    await this.queues.ensure(jobName);

    const concurrency = options?.concurrency ?? this.config.queue.job.concurrency;

    const workOptions: WorkOptions = { localConcurrency: concurrency };

    const handler: WorkHandler<T> = async (jobs) => {
      for (const job of jobs) await processor(job.data);
    };

    await this.boss.work(jobName, workOptions, handler);

    return {
      jobName,
      registeredAt: new Date(),
    };
  }

  async closeAll(): Promise<void> {
    await this.boss.stop();
  }
}
