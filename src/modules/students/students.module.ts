// modules/students/students.module.ts

import { CareersModule } from '@careers';
import { Module } from '@nestjs/common';
import { PersonsModule } from '@persons';
import { FileParserModule } from '@platform/files/parser';
import {
  STUDENT_FINDER_PORT,
  STUDENT_QUERY_PORT,
  STUDENT_REPOSITORY_PORT,
} from './application/ports';
import {
  BulkImportStudentsUseCase,
  CreateStudentUseCase,
  GetStudentByIdUseCase,
  ListStudentsUseCase,
} from './application/use-cases';
import { StudentRepository } from './infrastructure/persistence';
import { StudentsController } from './presentation/controllers';
import { FileParseInterceptor } from './presentation/interceptors';

@Module({
  imports: [FileParserModule, PersonsModule, CareersModule],
  providers: [
    CreateStudentUseCase,
    GetStudentByIdUseCase,
    ListStudentsUseCase,
    BulkImportStudentsUseCase,
    FileParseInterceptor,
    StudentRepository,
    {
      provide: STUDENT_REPOSITORY_PORT,
      useExisting: StudentRepository,
    },
    {
      provide: STUDENT_QUERY_PORT,
      useExisting: StudentRepository,
    },
    {
      provide: STUDENT_FINDER_PORT,
      useExisting: StudentRepository,
    },
  ],
  controllers: [StudentsController],
  exports: [STUDENT_FINDER_PORT],
})
export class StudentsModule {}
