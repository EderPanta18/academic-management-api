// modules/persons/application/ports/out/person-repository.port.ts

export const PERSON_REPOSITORY_PORT = Symbol('PERSON_REPOSITORY_PORT');

export interface IPersonRepository {
  existsByDni(dni: string): Promise<boolean>;

  existsByEmail(email: string): Promise<boolean>;
}
