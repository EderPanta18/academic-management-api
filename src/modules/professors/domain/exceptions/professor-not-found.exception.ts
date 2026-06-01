// modules/professors/domain/exceptions/professor-not-found.exception.ts

import { ProfessorException } from "./professor.exception";

export class ProfessorNotFoundException extends ProfessorException {
  readonly statusCode = 404;
  readonly errorKey = "PROFESSOR_NOT_FOUND";
  readonly errorCode = "PROF_001";

  constructor(id: number) {
    super(`No se encontró un profesor con el id ${id}`);
  }
}
