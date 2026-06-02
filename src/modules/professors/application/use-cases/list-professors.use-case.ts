// modules/professors/application/use-cases/list-professors.use-case.ts

import { Inject, Injectable } from "@nestjs/common";

import { PaginationVO, PaginatedResultDto } from "@core/pagination";
import {
  PROFESSOR_QUERY_PORT,
  type IProfessorQuery
} from "@professors/application/ports/out";
import { ListProfessorsQuery } from "../queries";
import type { ProfessorView } from "../read-models";

@Injectable()
export class ListProfessorsUseCase {
  constructor(
    @Inject(PROFESSOR_QUERY_PORT)
    private readonly professorQuery: IProfessorQuery
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListProfessorsQuery
  ): Promise<PaginatedResultDto<ProfessorView>> {
    const [views, total] = await this.professorQuery.findAll(pagination, {
      departmentId: query.departmentId
    });

    return PaginatedResultDto.from(views, total, pagination);
  }
}
