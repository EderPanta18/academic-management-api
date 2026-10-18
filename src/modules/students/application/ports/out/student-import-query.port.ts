import type { PaginationVO } from '@core/pagination';
import type { StudentImportReadModel } from '@students/application/read-models';
import type { StudentImportStatus } from '@students/domain/entities';

export const STUDENT_IMPORT_QUERY_TOKEN = Symbol('STUDENT_IMPORT_QUERY');

export type StudentImportQueryFilters = {
  status?: StudentImportStatus;
  createdByUserId?: string;
};

export interface IStudentImportQuery {
  find(id: string): Promise<StudentImportReadModel | null>;

  findAll(
    pagination: PaginationVO,
    filters?: StudentImportQueryFilters,
  ): Promise<[StudentImportReadModel[], number]>;
}
