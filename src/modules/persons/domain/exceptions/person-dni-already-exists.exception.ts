// modules/persons/domain/exceptions/person-dni-already-exists.exception.ts

import { PersonException } from "./person.exception";

export class PersonDniAlreadyExistsException extends PersonException {
  readonly statusCode = 409;
  readonly errorKey = "PERSON_DNI_ALREADY_EXISTS";
  readonly errorCode = "PER_001";

  constructor(dni: string) {
    super(`Ya existe una persona registrada con el DNI ${dni}.`);
  }
}
