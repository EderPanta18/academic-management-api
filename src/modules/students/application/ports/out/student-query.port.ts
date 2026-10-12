// modules/students/application/ports/out/student-query.port.ts

import type { PaginationVO } from '@core/pagination';
import type { StudentReadModel } from '@students/application/read-models';
import type { StudentStatus } from '@students/domain/enums';

export const STUDENT_QUERY_TOKEN = Symbol('STUDENT_QUERY');

export type StudentQueryFilters = {
  academicProgramId?: string;
  status?: StudentStatus;
  search?: string;
};

export interface IStudentQuery {
  find(id: string): Promise<StudentReadModel | null>;

  findAll(
    pagination: PaginationVO,
    filters?: StudentQueryFilters,
  ): Promise<[StudentReadModel[], number]>;
}
