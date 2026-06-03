// modules/professors/professors.module.ts

import { DepartmentsModule } from '@departments';
import { Module } from '@nestjs/common';
import { PersonsModule } from '@persons';
import {
  PROFESSOR_FINDER_PORT,
  PROFESSOR_QUERY_PORT,
  PROFESSOR_REPOSITORY_PORT,
} from './application/ports';
import {
  CreateProfessorUseCase,
  GetProfessorByIdUseCase,
  ListProfessorsUseCase,
} from './application/use-cases';
import { ProfessorRepository } from './infrastructure/persistence';
import { ProfessorsController } from './presentation/controllers';

@Module({
  imports: [PersonsModule, DepartmentsModule],
  providers: [
    CreateProfessorUseCase,
    GetProfessorByIdUseCase,
    ListProfessorsUseCase,
    ProfessorRepository,
    { provide: PROFESSOR_REPOSITORY_PORT, useExisting: ProfessorRepository },
    { provide: PROFESSOR_QUERY_PORT, useExisting: ProfessorRepository },
    { provide: PROFESSOR_FINDER_PORT, useExisting: ProfessorRepository },
  ],
  controllers: [ProfessorsController],
  exports: [PROFESSOR_FINDER_PORT],
})
export class ProfessorsModule {}
