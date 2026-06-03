// modules/students/application/use-cases/list-students.use-case.ts

import { Inject, Injectable } from "@nestjs/common";

import { PaginationVO, PaginatedResultDto } from "@core/pagination";
import type { StudentView } from "@students/application/read-models";
import {
  STUDENT_QUERY_PORT,
  type IStudentQuery
} from "@students/application/ports/out";
import { ListStudentsQuery } from "../queries";

@Injectable()
export class ListStudentsUseCase {
  constructor(
    @Inject(STUDENT_QUERY_PORT)
    private readonly studentQuery: IStudentQuery
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListStudentsQuery
  ): Promise<PaginatedResultDto<StudentView>> {
    const [views, total] = await this.studentQuery.findAll(pagination, {
      careerId: query.careerId
    });

    return PaginatedResultDto.from(views, total, pagination);
  }
}
