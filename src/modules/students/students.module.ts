// modules/students/students.module.ts

import { Module } from '@nestjs/common';
import { FileParserModule } from '@platform/files/parser';
import { PersonsModule } from '@modules/persons';
import { CareersModule } from '@modules/careers';
import {
  STUDENT_REPOSITORY_PORT,
  STUDENT_QUERY_PORT,
  STUDENT_FINDER_PORT,
} from './domain/ports';
import {
  CreateStudentUseCase,
  ListStudentsUseCase,
  GetStudentByIdUseCase,
  BulkImportStudentsUseCase,
} from './application/use-cases';
import { StudentRepository } from './infrastructure/persistence';
import { FileParseInterceptor } from './presentation/interceptors';
import { StudentsController } from './presentation/controllers';

@Module({
  imports: [FileParserModule, PersonsModule, CareersModule],
  providers: [
    CreateStudentUseCase,
    ListStudentsUseCase,
    GetStudentByIdUseCase,
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
