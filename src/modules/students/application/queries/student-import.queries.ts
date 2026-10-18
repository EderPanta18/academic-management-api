import type { StudentImportStatus } from '@students/domain/entities';

export type ListStudentImportsQuery = {
  status?: StudentImportStatus;
  createdByUserId?: string;
};
