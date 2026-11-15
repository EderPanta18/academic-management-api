import { PersonException } from '@persons/domain/exceptions';

export class PersonNotFoundException extends PersonException {
  readonly reason = 'NOT_FOUND';
  readonly errorCode = 'PERSON_NOT_FOUND';

  constructor(id: string) {
    super(`No se encontró una persona con el id "${id}".`);
  }
}
