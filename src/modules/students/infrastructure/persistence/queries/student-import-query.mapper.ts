import type { Prisma } from '@prisma/client';
import type { StudentImportReadModel } from '@students/application/read-models';
import type { StudentImportError, StudentImportStatus } from '@students/domain/entities';

export type StudentImportRaw = Prisma.StudentImportGetPayload<Record<string, never>>;

export class StudentImportQueryMapper {
  static toReadModel(raw: StudentImportRaw): StudentImportReadModel {
    return {
      id: raw.id,
      fileName: raw.fileName,
      fileExtension: raw.fileExtension,
      fileSize: raw.fileSize,
      fileMimeType: raw.fileMimeType,
      status: raw.status as StudentImportStatus,

      totalRows: raw.totalRows,
      processedRows: raw.processedRows,
      acceptedRows: raw.acceptedRows,
      rejectedRows: raw.rejectedRows,
      duplicatedRows: raw.duplicatedRows,
      observedRows: raw.observedRows,

      errors: (raw.errors as unknown as StudentImportError[] | null) ?? null,
      failureReason: raw.failureReason,

      createdByUserId: raw.createdByUserId,
      startedAt: raw.startedAt,
      finishedAt: raw.finishedAt,
    };
  }
}
