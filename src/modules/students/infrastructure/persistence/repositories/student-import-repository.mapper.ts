import { Prisma } from '@prisma/client';
import {
  StudentImport,
  type StudentImportError,
  type StudentImportStatus,
} from '@students/domain/entities';

type StudentImportRaw = Prisma.StudentImportGetPayload<Record<string, never>>;

type StudentImportPersistenceData = Omit<Prisma.StudentImportUncheckedCreateInput, 'fileContent'>;

export class StudentImportRepositoryMapper {
  static toDomain(raw: StudentImportRaw): StudentImport {
    return StudentImport.reconstitute({
      id: raw.id,
      fileName: raw.fileName,
      fileExtension: raw.fileExtension,
      fileHash: raw.fileHash,
      fileSize: raw.fileSize,
      fileMimeType: raw.fileMimeType,
      status: raw.status as StudentImportStatus,
      totalRows: raw.totalRows,
      processedRows: raw.processedRows,
      acceptedRows: raw.acceptedRows,
      rejectedRows: raw.rejectedRows,
      duplicatedRows: raw.duplicatedRows,
      observedRows: raw.observedRows,
      errors: raw.errors as StudentImportError[] | null,
      failureReason: raw.failureReason,
      createdByUserId: raw.createdByUserId,
      startedAt: raw.startedAt,
      finishedAt: raw.finishedAt,
    });
  }

  static toPersistence(studentImport: StudentImport): StudentImportPersistenceData {
    return {
      id: studentImport.id,
      fileName: studentImport.fileName,
      fileExtension: studentImport.fileExtension,
      fileHash: studentImport.fileHash,
      fileSize: studentImport.fileSize,
      fileMimeType: studentImport.fileMimeType,
      status: studentImport.status,
      totalRows: studentImport.totalRows,
      processedRows: studentImport.processedRows,
      acceptedRows: studentImport.acceptedRows,
      rejectedRows: studentImport.rejectedRows,
      duplicatedRows: studentImport.duplicatedRows,
      observedRows: studentImport.observedRows,
      // Prisma requiere Prisma.DbNull para guardar un JSON nulo en PostgreSQL
      errors:
        studentImport.errors === null
          ? Prisma.DbNull
          : (studentImport.errors as Prisma.InputJsonValue),
      failureReason: studentImport.failureReason,
      createdByUserId: studentImport.createdByUserId,
      startedAt: studentImport.startedAt,
      finishedAt: studentImport.finishedAt,
    };
  }

  static toBytes(buffer: Buffer): Uint8Array<ArrayBuffer> {
    return buffer as Uint8Array<ArrayBuffer>;
  }

  static fromBytes(bytes: Uint8Array): Buffer {
    return Buffer.from(bytes as Uint8Array<ArrayBuffer>);
  }
}
