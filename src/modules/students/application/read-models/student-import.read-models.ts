import type { StudentImportError, StudentImportStatus } from '@students/domain/entities';

export type StudentImportReadModel = {
  id: string;
  fileName: string;
  fileExtension: string;
  fileSize: number | null;
  fileMimeType: string | null;
  status: StudentImportStatus;

  // Contadores
  totalRows: number;
  processedRows: number;
  acceptedRows: number;
  rejectedRows: number;
  duplicatedRows: number;
  observedRows: number;

  // Resultados
  errors: StudentImportError[] | null;
  failureReason: string | null;

  // Auditoría
  createdByUserId: string;
  startedAt: Date | null;
  finishedAt: Date | null;
};
