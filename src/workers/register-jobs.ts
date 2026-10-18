// src/workers/register-jobs.ts

import { IJobQueue, JOB_QUEUE_TOKEN } from '@core/contracts';
import { type INestApplicationContext, Logger } from '@nestjs/common';
import { STUDENT_IMPORT_JOBS } from '@students/application/constants';
import { StudentImportProcessor } from '@students/entrypoints/queue';

export async function registerJobs(app: INestApplicationContext): Promise<void> {
  const logger = new Logger('RegisterJobs');

  // Obtenemos la implementación concreta de la cola (PgBoss)
  const jobQueue = app.get<IJobQueue>(JOB_QUEUE_TOKEN);

  const studentImportProcessor = app.get(StudentImportProcessor);

  await jobQueue.process<{ importId: string }>(STUDENT_IMPORT_JOBS.PROCESS, (payload) =>
    studentImportProcessor.handle(payload),
  );

  logger.log(`Job registrado: ${STUDENT_IMPORT_JOBS.PROCESS} -> StudentImportProcessor`);

  // ── Futuros Módulos ───────────────────────────────────────────────────────
  // A medida que agregues más procesadores, los registras aquí:
}
