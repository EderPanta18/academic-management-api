import type { PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { type IProfessorQuery, PROFESSOR_QUERY_TOKEN } from '../ports/out';
import type { ListProfessorsQuery } from '../queries';
import type { ProfessorReadModel } from '../read-models';

@Injectable()
export class ListProfessorsUseCase {
  constructor(
    @Inject(PROFESSOR_QUERY_TOKEN)
    private readonly professorQuery: IProfessorQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListProfessorsQuery = {},
  ): Promise<[ProfessorReadModel[], number]> {
    return await this.professorQuery.findAll(pagination, {
      department: query.department,
      status: query.status,
      search: query.search,
    });
  }
}
