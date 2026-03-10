// modules/students/domain/ports/out/student.repository.port.ts

import { Student } from '@students/domain/entities';

export interface PersonCreationData {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: Date | null;
}

/**
 * Puerto de salida WRITE
 */
export interface IStudentRepository {
  save(student: Student, personData: PersonCreationData): Promise<Student>;
  existsByCode(code: string): Promise<boolean>;
  existsByInstitutionalEmail(email: string): Promise<boolean>;
  delete(id: number): Promise<void>;
}
