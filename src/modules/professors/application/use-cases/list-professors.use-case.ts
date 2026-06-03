// modules/professors/application/use-cases/list-professors.use-case.ts

import { PaginatedResultDto, type PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { type IProfessorQuery, PROFESSOR_QUERY_PORT } from '@professors/application/ports/out';
import type { ListProfessorsQuery } from '../queries';
import type { ProfessorView } from '../read-models';

@Injectable()
export class ListProfessorsUseCase {
  constructor(
    @Inject(PROFESSOR_QUERY_PORT)
    private readonly professorQuery: IProfessorQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListProfessorsQuery,
  ): Promise<PaginatedResultDto<ProfessorView>> {
    const [views, total] = await this.professorQuery.findAll(pagination, {
      departmentId: query.departmentId,
    });

    return PaginatedResultDto.from(views, total, pagination);
  }
}
