// modules/students/domain/ports/out/student-query.port.ts

import { PaginationVO } from '@core/domain/value-objects';
import { StudentView } from '@students/domain/read-models';

export interface FindAllStudentsFilters {
  careerId?: number;
}

/**
 * Puerto de salida READ
 */
export interface IStudentQuery {
  findById(id: number): Promise<StudentView | null>;
  findAll(
    pagination: PaginationVO,
    filters?: FindAllStudentsFilters,
  ): Promise<[StudentView[], number]>;
}
