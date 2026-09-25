// core/contracts/job-queue.contract.ts

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

export type JobProcessor<T> = (payload: T) => Promise<void>;

export type JobHandle = {
  id: string;
  jobName: string;
  enqueuedAt: Date;
};

export type JobProcessorHandle = {
  jobName: string;
  registeredAt: Date;
};

export interface IJobQueue {
  enqueue<T>(jobName: string, payload: T, options?: JobEnqueueOptions): Promise<JobHandle>;

  process<T>(
    jobName: string,
    processor: JobProcessor<T>,
    options?: JobProcessOptions,
  ): Promise<JobProcessorHandle>;

  closeAll(): Promise<void>;
}
