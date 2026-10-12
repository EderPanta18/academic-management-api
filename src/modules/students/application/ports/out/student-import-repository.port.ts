import type { StudentImport } from '@students/domain/entities';
import type { StudentImportRowStatus } from '@students/domain/enums';

export const STUDENT_IMPORT_REPOSITORY_TOKEN = Symbol('STUDENT_IMPORT_REPOSITORY');

export type StudentImportRowData = {
  rowNumber: number;
  rawData: unknown;
  normalizedData: unknown | null;
  status: StudentImportRowStatus;
  errorSummary: string | null;
  fieldErrors: unknown | null;
  createdStudentId: string | null;
  updatedStudentId: string | null;
};

export interface IStudentImportRepository {
  create(studentImport: StudentImport, fileContent: Buffer): Promise<StudentImport>;

  update(studentImport: StudentImport): Promise<StudentImport>;

  find(id: string): Promise<StudentImport | null>;

  findFileContent(id: string): Promise<Buffer | null>;

  insertRows(importId: string, rows: StudentImportRowData[]): Promise<void>;
}
