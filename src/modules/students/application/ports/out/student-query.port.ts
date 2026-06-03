// modules/students/application/ports/out/student-query.port.ts

import { PaginationVO } from '@core/pagination';
import type { StudentView } from '@students/application/read-models';

export const STUDENT_QUERY_PORT = Symbol('STUDENT_QUERY_PORT');

export interface FindAllStudentsFilters {
  careerId?: number;
}

export interface IStudentQuery {
  findById(id: number): Promise<StudentView | null>;

  findAll(
    pagination: PaginationVO,
    filters?: FindAllStudentsFilters,
  ): Promise<[StudentView[], number]>;
}
