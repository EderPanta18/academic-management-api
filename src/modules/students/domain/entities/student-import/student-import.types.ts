import type { StudentImportStatus } from '@students/domain/enums';

export type StudentImportProps = {
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

export type CreateStudentImportProps = {
  id: string;
  fileName: string;
  fileSize?: number | null;
  fileMimeType?: string | null;
  totalRows: number;
  createdByUserId?: string | null;
};

export type StudentImportStats = {
  totalRows: number;
  processedRows: number;
  acceptedRows: number;
  rejectedRows: number;
  duplicatedRows: number;
  observedRows: number;
};
