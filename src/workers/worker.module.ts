// src/workers/worker.module.ts

import { Module } from '@nestjs/common';
import { PlatformModule } from '@platform';
import { StudentsModule } from '@students';

@Module({
  imports: [PlatformModule, StudentsModule],
})
export class WorkerModule {}
