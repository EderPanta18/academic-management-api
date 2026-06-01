// modules/professors/application/ports/out/professor-repository.port.ts

import { Professor } from "@professors/domain/entities";

export const PROFESSOR_REPOSITORY_PORT = Symbol("PROFESSOR_REPOSITORY_PORT");

export type ProfessorPersonData = {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: Date;
};

export type ProfessorSaveData = {
  professor: Professor;
  personData: ProfessorPersonData;
};

export interface IProfessorRepository {
  save(data: ProfessorSaveData): Promise<Professor>;

  existsByCode(code: string): Promise<boolean>;

  existsByInstitutionalEmail(email: string): Promise<boolean>;

  delete(id: number): Promise<void>;
}
