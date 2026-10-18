// modules/students/application/ports/out/student-repository.port.ts

import type { PersonCreationData } from '@identity';
import type { Student } from '@students/domain/entities';

export const STUDENT_REPOSITORY_TOKEN = Symbol('STUDENT_REPOSITORY');

export type StudentCreationData = {
  student: Student;
  personData: PersonCreationData;
};

export interface IStudentRepository {
  create(input: StudentCreationData): Promise<Student>;

  find(id: string): Promise<Student | null>;

  exists(id: string): Promise<boolean>;

  existsByCode(code: string): Promise<boolean>;

  existsByInstitutionalEmail(email: string): Promise<boolean>;
}
