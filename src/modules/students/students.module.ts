import { AcademicProgramsModule } from '@academic-programs';
import { IdentityModule } from '@identity';
import { Module } from '@nestjs/common';
import { FileParserModule } from '@platform/files';
import {
  STUDENT_CHECKER_TOKEN,
  STUDENT_FINDER_TOKEN,
  STUDENT_IMPORT_QUERY_TOKEN,
  STUDENT_IMPORT_REPOSITORY_TOKEN,
  STUDENT_QUERY_TOKEN,
  STUDENT_REPOSITORY_TOKEN,
  USER_EXISTENCE_CHECKER_TOKEN,
} from './application/ports';
import { StudentChecker, StudentFinder, StudentImportRowService } from './application/services';
import {
  CreateStudentUseCase,
  GetStudentByIdUseCase,
  GetStudentImportByIdUseCase,
  ListStudentImportsUseCase,
  ListStudentsUseCase,
  ProcessStudentImportUseCase,
  StartStudentImportUseCase,
} from './application/use-cases';
import { StudentImportsController, StudentsController } from './entrypoints/http';
import { StudentImportProcessor } from './entrypoints/queue';
import {
  FakeUserExistenceChecker,
  StudentImportQuery,
  StudentImportRepository,
  StudentQuery,
  StudentRepository,
} from './infrastructure/persistence';

@Module({
  imports: [IdentityModule, AcademicProgramsModule, FileParserModule],
  providers: [
    // ── Casos de Uso: Student ───────────────────────────────────────────────
    CreateStudentUseCase,
    GetStudentByIdUseCase,
    ListStudentsUseCase,

    // ── Casos de Uso: Student Import ────────────────────────────────────────
    StartStudentImportUseCase,
    ProcessStudentImportUseCase,
    GetStudentImportByIdUseCase,
    ListStudentImportsUseCase,

    // ── Servicios de Aplicación ─────────────────────────────────────────────
    StudentChecker,
    StudentFinder,
    StudentImportRowService,

    // ── Procesadores de Cola (Entrypoints) ──────────────────────────────────
    StudentImportProcessor,

    // ── Infraestructura (Adaptadores) ───────────────────────────────────────
    StudentRepository,
    StudentQuery,
    StudentImportRepository,
    StudentImportQuery,
    {
      provide: USER_EXISTENCE_CHECKER_TOKEN,
      useClass: FakeUserExistenceChecker, // TODO: Reemplazar cuando el módulo Users exista
    },

    // ── Bindings de Puertos (Out) ───────────────────────────────────────────
    {
      provide: STUDENT_REPOSITORY_TOKEN,
      useExisting: StudentRepository,
    },
    {
      provide: STUDENT_QUERY_TOKEN,
      useExisting: StudentQuery,
    },
    {
      provide: STUDENT_IMPORT_REPOSITORY_TOKEN,
      useExisting: StudentImportRepository,
    },
    {
      provide: STUDENT_IMPORT_QUERY_TOKEN,
      useExisting: StudentImportQuery,
    },

    // ── Bindings de Puertos (In) ────────────────────────────────────────────
    {
      provide: STUDENT_CHECKER_TOKEN,
      useClass: StudentChecker,
    },
    {
      provide: STUDENT_FINDER_TOKEN,
      useClass: StudentFinder,
    },
  ],
  controllers: [StudentsController, StudentImportsController],
  exports: [STUDENT_CHECKER_TOKEN, STUDENT_FINDER_TOKEN],
})
export class StudentsModule {}
