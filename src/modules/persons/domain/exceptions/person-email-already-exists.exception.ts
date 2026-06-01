// modules/persons/domain/exceptions/person-email-already-exists.exception.ts

import { PersonException } from "./person.exception";

export class PersonEmailAlreadyExistsException extends PersonException {
  readonly statusCode = 409;
  readonly errorKey = "PERSON_EMAIL_ALREADY_EXISTS";
  readonly errorCode = "PER_002";

  constructor(email: string) {
    super(`Ya existe una persona registrada con el email ${email}.`);
  }
}
