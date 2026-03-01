// modules/enrollments/enrollments.module.ts

import { Module } from '@nestjs/common';
import { StudentsModule } from '@modules/students';
import { CourseOfferingsModule } from '@modules/course-offerings';
import {
  ENROLLMENT_REPOSITORY_PORT,
  ENROLLMENT_FINDER_PORT,
} from '@enrollments/domain/ports';
import {
  EnrollStudentUseCase,
  ListEnrollmentsUseCase,
  GetEnrollmentByIdUseCase,
} from '@enrollments/application/use-cases';
import { EnrollmentPrismaRepository } from '@enrollments/infrastructure/persistence';
import { EnrollmentsController } from '@enrollments/presentation/controllers';

@Module({
  controllers: [EnrollmentsController],
  imports: [StudentsModule, CourseOfferingsModule],
  providers: [
    EnrollStudentUseCase,
    ListEnrollmentsUseCase,
    GetEnrollmentByIdUseCase,
    EnrollmentPrismaRepository,
    {
      provide: ENROLLMENT_REPOSITORY_PORT,
      useExisting: EnrollmentPrismaRepository,
    },
    {
      provide: ENROLLMENT_FINDER_PORT,
      useExisting: EnrollmentPrismaRepository,
    },
  ],
  exports: [ENROLLMENT_FINDER_PORT],
})
export class EnrollmentsModule {}
