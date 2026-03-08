// modules/enrollments/enrollments.module.ts

import { Module } from '@nestjs/common';
import { StudentsModule } from '@modules/students';
import { CourseOfferingsModule } from '@modules/course-offerings';
import {
  ENROLLMENT_REPOSITORY_PORT,
  ENROLLMENT_FINDER_PORT,
} from './domain/ports';
import {
  EnrollStudentUseCase,
  ListEnrollmentsUseCase,
  GetEnrollmentByIdUseCase,
} from './application/use-cases';
import { EnrollmentRepository } from './infrastructure/persistence';
import { EnrollmentsController } from './presentation/controllers';

@Module({
  imports: [StudentsModule, CourseOfferingsModule],
  providers: [
    EnrollStudentUseCase,
    ListEnrollmentsUseCase,
    GetEnrollmentByIdUseCase,
    EnrollmentRepository,
    {
      provide: ENROLLMENT_REPOSITORY_PORT,
      useExisting: EnrollmentRepository,
    },
    {
      provide: ENROLLMENT_FINDER_PORT,
      useExisting: EnrollmentRepository,
    },
  ],
  controllers: [EnrollmentsController],
  exports: [ENROLLMENT_FINDER_PORT],
})
export class EnrollmentsModule {}
