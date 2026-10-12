import type { PaginationVO } from '@core/pagination';
import type {
  StudentImportReadModel,
  StudentImportRowReadModel,
} from '@students/application/read-models';
import type { StudentImportRowStatus, StudentImportStatus } from '@students/domain/enums';

export const STUDENT_IMPORT_QUERY_TOKEN = Symbol('STUDENT_IMPORT_QUERY');

export type StudentImportQueryFilters = {
  status?: StudentImportStatus;
  createdByUserId?: string;
};

export type StudentImportRowQueryFilters = {
  status?: StudentImportRowStatus;
};

export interface IStudentImportQuery {
  find(id: string): Promise<StudentImportReadModel | null>;

  findAll(
    pagination: PaginationVO,
    filters?: StudentImportQueryFilters,
  ): Promise<[StudentImportReadModel[], number]>;

  findRowsByImportId(
    importId: string,
    pagination: PaginationVO,
    filters?: StudentImportRowQueryFilters,
  ): Promise<[StudentImportRowReadModel[], number]>;
}
