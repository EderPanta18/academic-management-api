// src/modules/identity/domain/exceptions/person.exception.ts

import { IdentityException } from './identity.exception';

export abstract class PersonException extends IdentityException {
  readonly entity = 'person';
}
