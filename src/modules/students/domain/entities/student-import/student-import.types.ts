import type { StudentImportStatus } from '@students/domain/entities';

export type StudentImportError = {
  row: number;
  reasons: string[];
};

export type StudentImportStats = {
  totalRows: number;
  processedRows: number;
  acceptedRows: number;
  rejectedRows: number;
  duplicatedRows: number;
  observedRows: number;
  errors: StudentImportError[];
};

export type StudentImportProgress = {
  processedRows: number;
  acceptedRows: number;
  rejectedRows: number;
  duplicatedRows: number;
  observedRows: number;
  errors: StudentImportError[];
};

export type StudentImportProps = {
  id: string;
  fileName: string;
  fileExtension: string;
  fileHash: string;
  fileSize: number | null;
  fileMimeType: string | null;
  status: StudentImportStatus;
  totalRows: number;
  processedRows: number;
  acceptedRows: number;
  rejectedRows: number;
  duplicatedRows: number;
  observedRows: number;
  errors: StudentImportError[] | null;
  failureReason: string | null;
  createdByUserId: string;
  startedAt: Date | null;
  finishedAt: Date | null;
};

export type CreateStudentImportProps = {
  id: string;
  fileName: string;
  fileExtension: string;
  fileHash: string;
  fileSize: number | null;
  fileMimeType: string | null;
  totalRows: number;
  createdByUserId: string;
};
