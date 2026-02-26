// modules/professors/professors.module.ts

import { Module } from '@nestjs/common';
import {
  PROFESSOR_REPOSITORY_PORT,
  PROFESSOR_FINDER_PORT,
} from '@professors/domain/ports';
import {
  CreateProfessorUseCase,
  ListProfessorsUseCase,
  GetProfessorByIdUseCase,
} from '@professors/application/use-cases';
import { ProfessorPrismaRepository } from '@professors/infrastructure/persistence';
import { ProfessorsController } from '@professors/presentation/controllers';

@Module({
  controllers: [ProfessorsController],
  providers: [
    CreateProfessorUseCase,
    ListProfessorsUseCase,
    GetProfessorByIdUseCase,
    ProfessorPrismaRepository,

    {
      provide: PROFESSOR_REPOSITORY_PORT,
      useExisting: ProfessorPrismaRepository,
    },
    {
      provide: PROFESSOR_FINDER_PORT,
      useExisting: ProfessorPrismaRepository,
    },
  ],
  exports: [PROFESSOR_FINDER_PORT],
})
export class ProfessorsModule {}
