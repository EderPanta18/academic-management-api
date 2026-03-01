// modules/professors/application/use-cases/list-professors.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { Professor } from '@professors/domain/entities';
import {
  PROFESSOR_REPOSITORY_PORT,
  type IProfessorRepository,
} from '@professors/domain/ports';
import { ListProfessorsQuery } from '../queries';

/**
 * Orquesta el listado paginado de profesores activos.
 */
@Injectable()
export class ListProfessorsUseCase {
  constructor(
    @Inject(PROFESSOR_REPOSITORY_PORT)
    private readonly repository: IProfessorRepository,
  ) {}

  async execute(
    pagination: PaginationVO,
    query?: ListProfessorsQuery,
  ): Promise<PaginatedResultDto<Professor>> {
    const [professors, total] = await this.repository.findAll(pagination, {
      departmentId: query?.departmentId,
    });
    return PaginatedResultDto.from(professors, total, pagination);
  }
}
