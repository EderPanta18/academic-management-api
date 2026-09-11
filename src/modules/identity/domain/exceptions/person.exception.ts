import { IdentityException } from './identity.exception';

export abstract class PersonException extends IdentityException {
  readonly entity = 'PERSON';
}
