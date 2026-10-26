// src/core/contracts/job-queue.contract.ts

export const JOB_QUEUE_TOKEN = Symbol('JOB_QUEUE');

export type JobEnqueueOptions = {
  priority?: number;
  delayMs?: number;
  maxAttempts?: number;
  idempotencyKey?: string;
};

export type JobProcessOptions = {
  concurrency?: number;
  timeoutMs?: number;
};

export type JobProcessor<T> = (payload: T) => Promise<void>;

export type JobEnqueueResult =
  | { status: 'accepted'; transportId?: string }
  | { status: 'duplicate'; transportId?: string };

export type JobProcessorHandle = {
  /** Detiene nuevas entregas y finaliza o libera de forma controlada las activas. */
  stop(): Promise<void>;
};

export interface IJobQueue {
  /**
   * Confirma solamente la aceptación técnica del trabajo por la cola.
   * 'duplicate' requiere evidencia de una aceptación anterior equivalente.
   * Los fallos o resultados no verificables se propagan, no se tratan como éxito.
   * El resultado no representa admisión funcional ni ejecución completada.
   */
  enqueue<T>(jobName: string, payload: T, options?: JobEnqueueOptions): Promise<JobEnqueueResult>;

  process<T>(
    jobName: string,
    processor: JobProcessor<T>,
    options?: JobProcessOptions,
  ): Promise<JobProcessorHandle>;
}
