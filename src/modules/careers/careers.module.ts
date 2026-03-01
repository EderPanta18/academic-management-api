// modules/careers/careers.module.ts

import { Module } from '@nestjs/common';
import { CAREER_FINDER_PORT } from '@careers/domain/ports';
import { CareerPrismaRepository } from '@careers/infrastructure/persistence';

@Module({
  providers: [
    CareerPrismaRepository,
    {
      provide: CAREER_FINDER_PORT,
      useExisting: CareerPrismaRepository,
    },
  ],
  exports: [CAREER_FINDER_PORT],
})
export class CareersModule {}
