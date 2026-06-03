// modules/students/application/use-cases/list-students.use-case.ts

import { PaginatedResultDto, PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { type IStudentQuery, STUDENT_QUERY_PORT } from '@students/application/ports/out';
import type { StudentView } from '@students/application/read-models';
import { ListStudentsQuery } from '../queries';

@Injectable()
export class ListStudentsUseCase {
  constructor(
    @Inject(STUDENT_QUERY_PORT)
    private readonly studentQuery: IStudentQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListStudentsQuery,
  ): Promise<PaginatedResultDto<StudentView>> {
    const [views, total] = await this.studentQuery.findAll(pagination, {
      careerId: query.careerId,
    });

    return PaginatedResultDto.from(views, total, pagination);
  }
}
