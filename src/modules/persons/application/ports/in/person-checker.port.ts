// src/modules/persons/application/ports/in/person-checker.port.ts

export const PERSON_CHECKER_TOKEN = Symbol('PERSON_CHECKER');

export interface IPersonChecker {
  /** Comprueba si existe una persona. */
  exists(id: string): Promise<boolean>;
}
