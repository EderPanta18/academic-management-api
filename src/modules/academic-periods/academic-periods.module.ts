import { Module } from '@nestjs/common';
import {
  ACADEMIC_PERIOD_CHECKER_TOKEN,
  ACADEMIC_PERIOD_QUERY_TOKEN,
  ACADEMIC_PERIOD_REPOSITORY_TOKEN,
} from './application/ports';
import { AcademicPeriodChecker } from './application/services';
import {
  CancelAcademicPeriodUseCase,
  CloseAcademicPeriodUseCase,
  CreateAcademicPeriodUseCase,
  GetAcademicPeriodByIdUseCase,
  ListAcademicPeriodsUseCase,
  OpenAcademicPeriodUseCase,
  StartAcademicPeriodUseCase,
} from './application/use-cases';
import { AcademicPeriodsController } from './entrypoints/http';
import { AcademicPeriodQuery, AcademicPeriodRepository } from './infrastructure/persistence';

@Module({
  providers: [
    // ── Casos de uso ────────────────────────────────────────────────────────
    CreateAcademicPeriodUseCase,
    GetAcademicPeriodByIdUseCase,
    ListAcademicPeriodsUseCase,
    OpenAcademicPeriodUseCase,
    StartAcademicPeriodUseCase,
    CloseAcademicPeriodUseCase,
    CancelAcademicPeriodUseCase,

    // ── Bindings de puertos (out) ───────────────────────────────────────────
    {
      provide: ACADEMIC_PERIOD_REPOSITORY_TOKEN,
      useExisting: AcademicPeriodRepository,
    },
    {
      provide: ACADEMIC_PERIOD_QUERY_TOKEN,
      useExisting: AcademicPeriodQuery,
    },

    // ── Bindings de puertos (in) ────────────────────────────────────────────
    {
      provide: ACADEMIC_PERIOD_CHECKER_TOKEN,
      useClass: AcademicPeriodChecker,
    },
  ],
  controllers: [AcademicPeriodsController],
  exports: [ACADEMIC_PERIOD_CHECKER_TOKEN],
})
export class AcademicPeriodsModule {}
