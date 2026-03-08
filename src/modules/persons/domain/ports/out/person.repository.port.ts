// modules/persons/domain/ports/out/person.repository.port.ts

export interface IPersonRepository {
  existsByDni(dni: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}
