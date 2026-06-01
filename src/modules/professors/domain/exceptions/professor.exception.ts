// modules/professors/domain/exceptions/professor.exception.ts

import { DomainException } from "@core/exceptions";

export abstract class ProfessorException extends DomainException {
  readonly domain = "PROFESSOR";
}
