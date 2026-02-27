// modules/academic-periods/academic-periods.module.ts

import { Module } from '@nestjs/common';
import { ACADEMIC_PERIOD_FINDER_PORT } from '@academic-periods/domain/ports';
import { AcademicPeriodPrismaRepository } from '@academic-periods/infrastructure/persistence';

@Module({
  providers: [
    AcademicPeriodPrismaRepository,
    {
      provide: ACADEMIC_PERIOD_FINDER_PORT,
      useExisting: AcademicPeriodPrismaRepository,
    },
  ],
  exports: [ACADEMIC_PERIOD_FINDER_PORT],
})
export class AcademicPeriodsModule {}
