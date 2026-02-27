// modules/course-offerings/course-offerings.module.ts

import { Module } from '@nestjs/common';
import { AcademicPeriodsModule } from '@modules/academic-periods';
import { CoursesModule } from '@modules/courses';
import { ProfessorsModule } from '@modules/professors';
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  COURSE_OFFERING_FINDER_PORT,
} from '@course-offerings/domain/ports';
import {
  CreateCourseOfferingUseCase,
  ListCourseOfferingsUseCase,
  GetCourseOfferingByIdUseCase,
  AssignProfessorToOfferingUseCase,
  ActivateCourseOfferingUseCase,
} from '@course-offerings/application/use-cases';
import { CourseOfferingPrismaRepository } from '@course-offerings/infrastructure/persistence';
import { CourseOfferingsController } from '@course-offerings/presentation/controllers';

@Module({
  controllers: [CourseOfferingsController],
  imports: [AcademicPeriodsModule, CoursesModule, ProfessorsModule],
  providers: [
    CreateCourseOfferingUseCase,
    ListCourseOfferingsUseCase,
    GetCourseOfferingByIdUseCase,
    AssignProfessorToOfferingUseCase,
    ActivateCourseOfferingUseCase,
    CourseOfferingPrismaRepository,
    {
      provide: COURSE_OFFERING_REPOSITORY_PORT,
      useExisting: CourseOfferingPrismaRepository,
    },
    {
      provide: COURSE_OFFERING_FINDER_PORT,
      useExisting: CourseOfferingPrismaRepository,
    },
  ],
  exports: [COURSE_OFFERING_REPOSITORY_PORT],
})
export class CourseOfferingsModule {}
