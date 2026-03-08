// modules/course-offerings/course-offerings.module.ts

import { Module } from '@nestjs/common';
import { AcademicPeriodsModule } from '@modules/academic-periods';
import { CoursesModule } from '@modules/courses';
import { ProfessorsModule } from '@modules/professors';
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  COURSE_OFFERING_FINDER_PORT,
} from './domain/ports';
import {
  CreateCourseOfferingUseCase,
  ListCourseOfferingsUseCase,
  GetCourseOfferingByIdUseCase,
  AssignProfessorToOfferingUseCase,
  ActivateCourseOfferingUseCase,
} from './application/use-cases';
import { CourseOfferingRepository } from './infrastructure/persistence';
import { CourseOfferingsController } from './presentation/controllers';

@Module({
  imports: [AcademicPeriodsModule, CoursesModule, ProfessorsModule],
  providers: [
    CreateCourseOfferingUseCase,
    ListCourseOfferingsUseCase,
    GetCourseOfferingByIdUseCase,
    AssignProfessorToOfferingUseCase,
    ActivateCourseOfferingUseCase,
    CourseOfferingRepository,
    {
      provide: COURSE_OFFERING_REPOSITORY_PORT,
      useExisting: CourseOfferingRepository,
    },
    {
      provide: COURSE_OFFERING_FINDER_PORT,
      useExisting: CourseOfferingRepository,
    },
  ],
  controllers: [CourseOfferingsController],
  exports: [COURSE_OFFERING_FINDER_PORT],
})
export class CourseOfferingsModule {}
