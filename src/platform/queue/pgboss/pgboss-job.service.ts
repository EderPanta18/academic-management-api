// src/platform/queue/pgboss/pgboss-job.service.ts

import { createHash } from 'node:crypto';
import type {
  IJobQueue,
  JobEnqueueOptions,
  JobEnqueueResult,
  JobProcessOptions,
  JobProcessor,
  JobProcessorHandle,
} from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@platform/config';
import { PgBoss, type WorkHandler } from 'pg-boss';
import { QueueRegistry } from './queue-registry';

type JobEnvelope<T> = {
  payload: T;
  fingerprint?: string;
};

function stableJson(value: unknown): string {
  try {
    const serialized = JSON.stringify(value);

    if (serialized === undefined) throw new Error('Valor no serializable.');

    const sort = (data: unknown): unknown => {
      if (Array.isArray(data)) return data.map(sort);

      if (data !== null && typeof data === 'object')
        return Object.fromEntries(
          Object.entries(data)
            .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
            .map(([key, item]) => [key, sort(item)]),
        );

      return data;
    };

    return JSON.stringify(sort(JSON.parse(serialized)));
  } catch {
    throw new SystemException('No se pudo serializar el contenido del trabajo.');
  }
}

function createTransportId(jobName: string, key: string): string {
  const bytes = createHash('sha256')
    .update(stableJson([jobName, key]))
    .digest()
    .subarray(0, 16);

  bytes[6] = (bytes[6] & 0x0f) | 0x80;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}

@Injectable()
export class PgBossJobService implements IJobQueue {
  constructor(
    private readonly boss: PgBoss,
    private readonly queues: QueueRegistry,
    private readonly config: ConfigService,
  ) {}

  async enqueue<T>(
    jobName: string,
    payload: T,
    options?: JobEnqueueOptions,
  ): Promise<JobEnqueueResult> {
    if (options?.idempotencyKey !== undefined && options.idempotencyKey.trim().length === 0) {
      throw new SystemException('La clave de idempotencia no puede estar vacía.');
    }

    if (
      options?.maxAttempts !== undefined &&
      (!Number.isSafeInteger(options.maxAttempts) || options.maxAttempts < 1)
    )
      throw new SystemException('maxAttempts debe ser un entero positivo.');

    if (
      options?.delayMs !== undefined &&
      (!Number.isSafeInteger(options.delayMs) ||
        options.delayMs < 0 ||
        !Number.isFinite(Date.now() + options.delayMs) ||
        Math.abs(Date.now() + options.delayMs) > 8_640_000_000_000_000)
    )
      throw new SystemException('delayMs debe representar un retraso válido.');

    await this.queues.ensure(jobName);

    const transportId = options?.idempotencyKey
      ? createTransportId(jobName, options.idempotencyKey)
      : undefined;

    const fingerprint = transportId
      ? createHash('sha256')
          .update(
            stableJson({
              payload,
              priority: options?.priority ?? null,
              delayMs: options?.delayMs ?? 0,
              maxAttempts: options?.maxAttempts ?? null,
            }),
          )
          .digest('hex')
      : undefined;

    const data: JobEnvelope<T> = {
      payload,
      ...(fingerprint ? { fingerprint } : {}),
    };

    const confirmDuplicate = async (): Promise<JobEnqueueResult> => {
      if (!transportId || !fingerprint)
        throw new SystemException('No se pudo confirmar la aceptación del trabajo.');

      const existing = await this.boss.findJobs<JobEnvelope<T>>(jobName, { id: transportId });

      if (existing.length !== 1 || existing[0].data.fingerprint !== fingerprint)
        throw new SystemException('No se pudo confirmar una aceptación anterior equivalente.');

      return {
        status: 'duplicate',
        transportId,
      };
    };

    try {
      const id = await this.boss.send(jobName, data, {
        id: transportId,
        priority: options?.priority,
        startAfter: options?.delayMs ? new Date(Date.now() + options.delayMs) : undefined,
        retryLimit: options?.maxAttempts !== undefined ? options.maxAttempts - 1 : undefined,
      });

      if (id)
        return {
          status: 'accepted',
          transportId: id,
        };

      return await confirmDuplicate();
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;

      return confirmDuplicate();
    }
  }

  async process<T>(
    jobName: string,
    processor: JobProcessor<T>,
    options?: JobProcessOptions,
  ): Promise<JobProcessorHandle> {
    if (options?.timeoutMs !== undefined)
      throw new SystemException(
        'timeoutMs no puede aplicarse de forma segura mediante PgBoss.work().',
      );

    const concurrency = options?.concurrency ?? this.config.queue.job.concurrency;

    if (!Number.isSafeInteger(concurrency) || concurrency < 1)
      throw new SystemException('La concurrencia del procesador debe ser un entero positivo.');

    await this.queues.ensure(jobName);

    const handler: WorkHandler<JobEnvelope<T>> = async (jobs) => {
      for (const job of jobs) await processor(job.data.payload);
    };

    const workerId = await this.boss.work(
      jobName,
      {
        localConcurrency: concurrency,
        batchSize: 1,
      },
      handler,
    );

    return {
      stop: async (): Promise<void> => {
        await this.boss.offWork(jobName, {
          id: workerId,
          wait: true,
        });
      },
    };
  }
}
