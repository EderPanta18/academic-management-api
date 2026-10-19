import type { PersonCreationData } from '@identity';
import type { Professor } from '@professors/domain/entities';

export const PROFESSOR_REPOSITORY_TOKEN = Symbol('PROFESSOR_REPOSITORY');

export type ProfessorCreationData = {
  professor: Professor;
  personData: PersonCreationData;
};

export interface IProfessorRepository {
  create(input: ProfessorCreationData): Promise<Professor>;

  find(id: string): Promise<Professor | null>;

  exists(id: string): Promise<boolean>;

  existsByCode(code: string): Promise<boolean>;

  existsByInstitutionalEmail(email: string): Promise<boolean>;
}
