import type { StudentImport } from '@students/domain/entities';

export const STUDENT_IMPORT_REPOSITORY_TOKEN = Symbol('STUDENT_IMPORT_REPOSITORY');

export interface IStudentImportRepository {
  create(studentImport: StudentImport, fileContent: Buffer): Promise<StudentImport>;

  update(studentImport: StudentImport): Promise<StudentImport>;

  find(id: string): Promise<StudentImport | null>;

  findFileContent(id: string): Promise<Buffer | null>;

  existsByHashAndUser(fileHash: string, createdByUserId: string): Promise<boolean>;
}
