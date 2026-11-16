// src/modules/persons/application/ports/out/person-repository.port.ts

import type { Person } from '@persons/domain/entities';

export const PERSON_REPOSITORY_TOKEN = Symbol('PERSON_REPOSITORY');

export interface IPersonRepository {
  /**
   * Registra una persona.
   */
  create(person: Person): Promise<void>;

  /**
   * Actualiza una persona.
   */
  update(person: Person): Promise<void>;

  /**
   * Busca una persona por su identificador.
   */
  find(id: string): Promise<Person | null>;

  /**
   * Comprueba si existe una persona.
   */
  exists(id: string): Promise<boolean>;

  /**
   * Comprueba si existe una persona con el documento indicado.
   */
  existsByDocument(documentTypeId: string, documentNumber: string): Promise<boolean>;

  /**
   * Comprueba si existe una persona con el correo indicado.
   */
  existsByEmail(email: string): Promise<boolean>;
}
