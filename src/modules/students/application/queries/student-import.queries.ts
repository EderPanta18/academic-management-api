import type { StudentImportRowStatus, StudentImportStatus } from '@students/domain/enums';

export type ListStudentImportsQuery = {
  status?: StudentImportStatus;
  createdByUserId?: string;
};

export type ListStudentImportRowsQuery = {
  status?: StudentImportRowStatus;
};
