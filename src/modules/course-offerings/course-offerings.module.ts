// modules/course-offerings/course-offerings.module.ts

import { Module } from "@nestjs/common";

import { AcademicPeriodsModule } from "@academic-periods";
import { CoursesModule } from "@courses";
import { ProfessorsModule } from "@professors";
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  COURSE_OFFERING_FINDER_PORT
} from "./application/ports";
import {
  CreateCourseOfferingUseCase,
  GetCourseOfferingByIdUseCase,
  ListCourseOfferingsUseCase,
  AssignProfessorToOfferingUseCase,
  ActivateCourseOfferingUseCase
} from "./application/use-cases";
import { CourseOfferingRepository } from "./infrastructure/persistence";
import { CourseOfferingsController } from "./presentation/controllers";

@Module({
  imports: [AcademicPeriodsModule, CoursesModule, ProfessorsModule],
  providers: [
    CreateCourseOfferingUseCase,
    GetCourseOfferingByIdUseCase,
    ListCourseOfferingsUseCase,
    AssignProfessorToOfferingUseCase,
    ActivateCourseOfferingUseCase,
    CourseOfferingRepository,
    {
      provide: COURSE_OFFERING_REPOSITORY_PORT,
      useExisting: CourseOfferingRepository
    },
    {
      provide: COURSE_OFFERING_FINDER_PORT,
      useExisting: CourseOfferingRepository
    }
  ],
  controllers: [CourseOfferingsController],
  exports: [COURSE_OFFERING_FINDER_PORT]
})
export class CourseOfferingsModule {}
