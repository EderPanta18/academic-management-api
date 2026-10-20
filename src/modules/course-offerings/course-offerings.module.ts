import { AcademicPeriodsModule } from '@academic-periods';
import { CoursesModule } from '@courses';
import { Module } from '@nestjs/common';
import { ProfessorsModule } from '@professors';
import {
  COURSE_OFFERING_CHECKER_TOKEN,
  COURSE_OFFERING_FINDER_TOKEN,
  COURSE_OFFERING_QUERY_TOKEN,
  COURSE_OFFERING_REPOSITORY_TOKEN,
} from './application/ports';
import { CourseOfferingChecker, CourseOfferingFinder } from './application/services';
import {
  AssignProfessorToOfferingUseCase,
  CancelCourseOfferingUseCase,
  CloseCourseOfferingUseCase,
  CreateCourseOfferingUseCase,
  FinishCourseOfferingUseCase,
  GetCourseOfferingByIdUseCase,
  ListCourseOfferingsUseCase,
  OpenCourseOfferingUseCase,
} from './application/use-cases';
import { CourseOfferingsController } from './entrypoints/http';
import { CourseOfferingQuery, CourseOfferingRepository } from './infrastructure/persistence';

@Module({
  imports: [AcademicPeriodsModule, CoursesModule, ProfessorsModule],
  providers: [
    // ── Casos de uso ────────────────────────────────────────────────────────
    CreateCourseOfferingUseCase,
    GetCourseOfferingByIdUseCase,
    ListCourseOfferingsUseCase,
    AssignProfessorToOfferingUseCase,
    OpenCourseOfferingUseCase,
    CloseCourseOfferingUseCase,
    FinishCourseOfferingUseCase,
    CancelCourseOfferingUseCase,

    // ── Bindings de puertos (out) ───────────────────────────────────────────
    {
      provide: COURSE_OFFERING_REPOSITORY_TOKEN,
      useExisting: CourseOfferingRepository,
    },
    {
      provide: COURSE_OFFERING_QUERY_TOKEN,
      useExisting: CourseOfferingQuery,
    },

    // ── Bindings de puertos (in) ────────────────────────────────────────────
    {
      provide: COURSE_OFFERING_CHECKER_TOKEN,
      useClass: CourseOfferingChecker,
    },
    {
      provide: COURSE_OFFERING_FINDER_TOKEN,
      useClass: CourseOfferingFinder,
    },
  ],
  controllers: [CourseOfferingsController],
  exports: [COURSE_OFFERING_CHECKER_TOKEN, COURSE_OFFERING_FINDER_TOKEN],
})
export class CourseOfferingsModule {}
