import { IdentityModule } from '@identity';
import { Module } from '@nestjs/common';
import {
  PROFESSOR_CHECKER_TOKEN,
  PROFESSOR_QUERY_TOKEN,
  PROFESSOR_REPOSITORY_TOKEN,
} from './application/ports';
import { ProfessorChecker } from './application/services';
import {
  CreateProfessorUseCase,
  GetProfessorByIdUseCase,
  ListProfessorsUseCase,
} from './application/use-cases';
import { ProfessorsController } from './entrypoints/http';
import { ProfessorQuery, ProfessorRepository } from './infrastructure/persistence';

@Module({
  imports: [IdentityModule],
  providers: [
    CreateProfessorUseCase,
    GetProfessorByIdUseCase,
    ListProfessorsUseCase,
    {
      provide: PROFESSOR_REPOSITORY_TOKEN,
      useExisting: ProfessorRepository,
    },
    {
      provide: PROFESSOR_QUERY_TOKEN,
      useExisting: ProfessorQuery,
    },
    {
      provide: PROFESSOR_CHECKER_TOKEN,
      useClass: ProfessorChecker,
    },
  ],
  controllers: [ProfessorsController],
  exports: [PROFESSOR_CHECKER_TOKEN],
})
export class ProfessorsModule {}
