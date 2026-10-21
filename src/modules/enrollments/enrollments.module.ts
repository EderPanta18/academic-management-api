import { CourseOfferingsModule } from '@course-offerings';
import { CoursesModule } from '@courses';
import { Module } from '@nestjs/common';
import { StudentsModule } from '@students';
import {
  ENROLLMENT_CHECKER_TOKEN,
  ENROLLMENT_QUERY_TOKEN,
  ENROLLMENT_REPOSITORY_TOKEN,
  ENROLLMENT_STATUS_LOG_QUERY_TOKEN,
} from './application/ports';
import { EnrollmentChecker } from './application/services';
import {
  CancelEnrollmentUseCase,
  ConfirmEnrollmentUseCase,
  EnrollStudentUseCase,
  FinishEnrollmentUseCase,
  GetEnrollmentByIdUseCase,
  GetEnrollmentHistoryUseCase,
  ListEnrollmentsUseCase,
  RejectEnrollmentUseCase,
  WithdrawEnrollmentUseCase,
} from './application/use-cases';
import { EnrollmentsController } from './entrypoints/http';
import {
  EnrollmentQuery,
  EnrollmentRepository,
  EnrollmentStatusLogQuery,
} from './infrastructure/persistence';

@Module({
  imports: [StudentsModule, CourseOfferingsModule, CoursesModule],
  providers: [
    // ── Casos de uso ────────────────────────────────────────────────────────
    EnrollStudentUseCase,
    GetEnrollmentByIdUseCase,
    GetEnrollmentHistoryUseCase,
    ListEnrollmentsUseCase,
    ConfirmEnrollmentUseCase,
    CancelEnrollmentUseCase,
    WithdrawEnrollmentUseCase,
    RejectEnrollmentUseCase,
    FinishEnrollmentUseCase,

    // ── Bindings de puertos (out) ───────────────────────────────────────────
    {
      provide: ENROLLMENT_REPOSITORY_TOKEN,
      useExisting: EnrollmentRepository,
    },
    {
      provide: ENROLLMENT_QUERY_TOKEN,
      useExisting: EnrollmentQuery,
    },
    {
      provide: ENROLLMENT_STATUS_LOG_QUERY_TOKEN,
      useExisting: EnrollmentStatusLogQuery,
    },

    // ── Bindings de puertos (in) ────────────────────────────────────────────
    {
      provide: ENROLLMENT_CHECKER_TOKEN,
      useClass: EnrollmentChecker,
    },
  ],
  controllers: [EnrollmentsController],
  exports: [ENROLLMENT_CHECKER_TOKEN],
})
export class EnrollmentsModule {}
