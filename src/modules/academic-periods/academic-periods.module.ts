// modules/academic-periods/academic-periods.module.ts

import { Module } from '@nestjs/common';
import { ACADEMIC_PERIOD_FINDER_PORT } from './application/ports';
import { AcademicPeriodRepository } from './infrastructure/persistence';

@Module({
  providers: [
    AcademicPeriodRepository,
    {
      provide: ACADEMIC_PERIOD_FINDER_PORT,
      useExisting: AcademicPeriodRepository,
    },
  ],
  exports: [ACADEMIC_PERIOD_FINDER_PORT],
})
export class AcademicPeriodsModule {}
