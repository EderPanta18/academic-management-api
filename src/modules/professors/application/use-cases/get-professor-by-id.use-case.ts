import { Inject, Injectable } from '@nestjs/common';
import { ProfessorNotFoundException } from '../exceptions';
import { type IProfessorQuery, PROFESSOR_QUERY_TOKEN } from '../ports/out';
import type { ProfessorReadModel } from '../read-models';

@Injectable()
export class GetProfessorByIdUseCase {
  constructor(
    @Inject(PROFESSOR_QUERY_TOKEN)
    private readonly professorQuery: IProfessorQuery,
  ) {}

  async execute(id: string): Promise<ProfessorReadModel> {
    const readModel = await this.professorQuery.find(id);

    if (!readModel) throw new ProfessorNotFoundException(id);

    return readModel;
  }
}
