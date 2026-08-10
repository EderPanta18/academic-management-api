// src/core/contracts/job-queue.contract.ts

export const JOB_QUEUE_TOKEN = Symbol('JOB_QUEUE');

export type JobEnqueueOptions = {
  priority?: number;
  delay?: number;
  attempts?: number;
  jobId?: string;
};

export type JobProcessOptions = {
  concurrency?: number;
  timeoutMs?: number;
  lockDurationMs?: number;
};

export type JobStatus = 'pending' | 'active' | 'completed' | 'failed' | 'delayed' | 'unknown';

export interface JobHandle {
  id: string;
  getStatus(): Promise<JobStatus>;
}

export type JobProcessor<T extends Record<string, unknown>> = (payload: T) => Promise<void>;

export interface JobQueue {
  enqueue<T extends Record<string, unknown>>(
    jobName: string,
    payload: T,
    options?: JobEnqueueOptions,
  ): Promise<JobHandle>;

  process<T extends Record<string, unknown>>(
    jobName: string,
    processor: JobProcessor<T>,
    options?: JobProcessOptions,
  ): Promise<void>;

  unregister(jobName: string): Promise<void>;

  closeAll(): Promise<void>;
}
