// modules/professors/application/use-cases/list-professors.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { PaginationVO } from '@core/domain/value-objects';
import { PaginatedResultDto } from '@core/application/dtos';
import { type ProfessorView } from '@professors/domain/read-models';
import {
  PROFESSOR_QUERY_PORT,
  type IProfessorQuery,
} from '@professors/domain/ports/out';
import { ListProfessorsQuery } from '../queries';

@Injectable()
export class ListProfessorsUseCase {
  constructor(
    @Inject(PROFESSOR_QUERY_PORT)
    private readonly query: IProfessorQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query?: ListProfessorsQuery,
  ): Promise<PaginatedResultDto<ProfessorView>> {
    const [views, total] = await this.query.findAll(pagination, {
      departmentId: query?.departmentId,
    });
    return PaginatedResultDto.from(views, total, pagination);
  }
}
