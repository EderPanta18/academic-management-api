import type { PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { type IStudentQuery, STUDENT_QUERY_TOKEN } from '@students/application/ports/out';
import type { ListStudentsQuery } from '@students/application/queries';
import type { StudentReadModel } from '@students/application/read-models';

@Injectable()
export class ListStudentsUseCase {
  constructor(
    @Inject(STUDENT_QUERY_TOKEN)
    private readonly studentQuery: IStudentQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListStudentsQuery = {},
  ): Promise<[StudentReadModel[], number]> {
    return await this.studentQuery.findAll(pagination, {
      academicProgramId: query.academicProgramId,
      status: query.status,
      search: query.search,
    });
  }
}
