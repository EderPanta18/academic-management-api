// modules/professors/professors.module.ts

import { Module } from "@nestjs/common";

import { PersonsModule } from "@persons";
import { DepartmentsModule } from "@departments";
import {
  PROFESSOR_REPOSITORY_PORT,
  PROFESSOR_QUERY_PORT,
  PROFESSOR_FINDER_PORT
} from "./application/ports";
import {
  CreateProfessorUseCase,
  GetProfessorByIdUseCase,
  ListProfessorsUseCase
} from "./application/use-cases";
import { ProfessorRepository } from "./infrastructure/persistence";
import { ProfessorsController } from "./presentation/controllers";

@Module({
  imports: [PersonsModule, DepartmentsModule],
  providers: [
    CreateProfessorUseCase,
    GetProfessorByIdUseCase,
    ListProfessorsUseCase,
    ProfessorRepository,
    { provide: PROFESSOR_REPOSITORY_PORT, useExisting: ProfessorRepository },
    { provide: PROFESSOR_QUERY_PORT, useExisting: ProfessorRepository },
    { provide: PROFESSOR_FINDER_PORT, useExisting: ProfessorRepository }
  ],
  controllers: [ProfessorsController],
  exports: [PROFESSOR_FINDER_PORT]
})
export class ProfessorsModule {}
