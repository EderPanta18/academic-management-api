// modules/professors/application/use-cases/get-professor-by-id.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { Professor } from '@professors/domain/entities';
import { ProfessorNotFoundException } from '@professors/domain/exceptions';
import {
  PROFESSOR_REPOSITORY_PORT,
  type IProfessorRepository,
} from '@professors/domain/ports';

@Injectable()
export class GetProfessorByIdUseCase {
  constructor(
    @Inject(PROFESSOR_REPOSITORY_PORT)
    private readonly repository: IProfessorRepository,
  ) {}

  async execute(id: number): Promise<Professor> {
    const professor = await this.repository.findById(id);
    if (!professor) throw new ProfessorNotFoundException(id);
    return professor;
  }
}
