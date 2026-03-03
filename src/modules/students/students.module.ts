// modules/students/students.module.ts

import { Module } from '@nestjs/common';
import { FileParserModule } from '@shared/infrastructure/file-parser';
import { CareersModule } from '@modules/careers';
import {
  STUDENT_REPOSITORY_PORT,
  STUDENT_FINDER_PORT,
} from '@students/domain/ports';
import {
  CreateStudentUseCase,
  ListStudentsUseCase,
  GetStudentByIdUseCase,
  BulkImportStudentsUseCase,
} from '@students/application/use-cases';
import { StudentPrismaRepository } from '@students/infrastructure/persistence';
import { FileParseInterceptor } from '@students/presentation/interceptors';
import { StudentsController } from '@students/presentation/controllers';

@Module({
  controllers: [StudentsController],
  imports: [FileParserModule, CareersModule],
  providers: [
    CreateStudentUseCase,
    ListStudentsUseCase,
    GetStudentByIdUseCase,
    BulkImportStudentsUseCase,
    StudentPrismaRepository,
    {
      provide: STUDENT_REPOSITORY_PORT,
      useExisting: StudentPrismaRepository,
    },
    {
      provide: STUDENT_FINDER_PORT,
      useExisting: StudentPrismaRepository,
    },
    FileParseInterceptor,
  ],
  exports: [STUDENT_FINDER_PORT],
})
export class StudentsModule {}
