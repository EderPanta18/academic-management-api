// modules/persons/domain/exceptions/person.exception.ts

import { DomainException } from "@core/exceptions";

export abstract class PersonException extends DomainException {
  readonly domain = "PERSON";
}
