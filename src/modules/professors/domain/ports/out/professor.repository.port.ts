// modules/professors/domain/ports/out/professor.repository.port.ts

import { Professor } from '@professors/domain/entities';

/**
 * Datos de persona que el repositorio necesita para
 * crear/actualizar la tabla person en la misma transacción.
 */
export interface PersonCreationData {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: Date | null;
}

export interface IProfessorRepository {
  save(
    professor: Professor,
    personData: PersonCreationData,
  ): Promise<Professor>;
  existsByCode(code: string): Promise<boolean>;
  existsByInstitutionalEmail(email: string): Promise<boolean>;
  delete(id: number): Promise<void>;
}
