import type { PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import {
  type IStudentImportQuery,
  STUDENT_IMPORT_QUERY_TOKEN,
} from '@students/application/ports/out';
import type { ListStudentImportsQuery } from '@students/application/queries';
import type { StudentImportReadModel } from '@students/application/read-models';

@Injectable()
export class ListStudentImportsUseCase {
  constructor(
    @Inject(STUDENT_IMPORT_QUERY_TOKEN)
    private readonly studentImportQuery: IStudentImportQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListStudentImportsQuery = {},
  ): Promise<[StudentImportReadModel[], number]> {
    return await this.studentImportQuery.findAll(pagination, {
      status: query.status,
      createdByUserId: query.createdByUserId,
    });
  }
}
