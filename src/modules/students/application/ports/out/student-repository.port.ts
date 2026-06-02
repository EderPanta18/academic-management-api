// modules/students/application/ports/out/student-repository.port.ts

import type { PersonData } from "@persons/application/contracts";
import { Student } from "@students/domain/entities";

export const STUDENT_REPOSITORY_PORT = Symbol("STUDENT_REPOSITORY_PORT");

export type StudentSaveData = {
  student: Student;
  personData: PersonData;
};

export interface IStudentRepository {
  save(data: StudentSaveData): Promise<Student>;

  existsByCode(code: string): Promise<boolean>;

  existsByInstitutionalEmail(email: string): Promise<boolean>;

  delete(id: number): Promise<void>;
}
