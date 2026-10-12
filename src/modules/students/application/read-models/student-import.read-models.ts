import type { StudentImportRowStatus, StudentImportStatus } from '@students/domain/enums';
import type { StudentImportRowError } from '../types';

export type StudentImportReadModel = {
  id: string;
  fileName: string;
  fileSize: number | null;
  fileMimeType: string | null;
  status: StudentImportStatus;
  totalRows: number;
  processedRows: number;
  acceptedRows: number;
  rejectedRows: number;
  duplicatedRows: number;
  observedRows: number;
  createdByUserId: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
};

export type StudentImportRowReadModel = {
  id: string;
  studentImportId: string;
  rowNumber: number;
  status: StudentImportRowStatus;
  errorSummary: string | null;
  fieldErrors: StudentImportRowError[] | null;
  createdStudentId: string | null;
  updatedStudentId: string | null;
};
