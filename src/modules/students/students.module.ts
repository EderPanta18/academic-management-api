// modules/students/students.module.ts

import { Module } from '@nestjs/common';
import { CareersModule } from '@modules/careers';
import {
  STUDENT_REPOSITORY_PORT,
  STUDENT_FINDER_PORT,
} from '@students/domain/ports';
import {
  CreateStudentUseCase,
  ListStudentsUseCase,
  GetStudentByIdUseCase,
} from '@students/application/use-cases';
import { StudentPrismaRepository } from '@students/infrastructure/persistence';
import { StudentsController } from '@students/presentation/controllers';

@Module({
  controllers: [StudentsController],
  imports: [CareersModule],
  providers: [
    CreateStudentUseCase,
    ListStudentsUseCase,
    GetStudentByIdUseCase,
    StudentPrismaRepository,
    {
      provide: STUDENT_REPOSITORY_PORT,
      useExisting: StudentPrismaRepository,
    },
    {
      provide: STUDENT_FINDER_PORT,
      useExisting: StudentPrismaRepository,
    },
  ],
  exports: [STUDENT_FINDER_PORT],
})
export class StudentsModule {}
