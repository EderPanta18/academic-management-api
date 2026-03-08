// modules/persons/domain/ports/in/create-person.use-case.port.ts

import { Person, type CreatePersonProps } from '@persons/domain/entities';

export interface ICreatePersonUseCase {
  execute(data: CreatePersonProps): Promise<Person>;
}
