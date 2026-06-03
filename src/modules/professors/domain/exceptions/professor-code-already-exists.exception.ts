// modules/professors/domain/exceptions/professor-code-already-exists.exception.ts

import { ProfessorException } from './professor.exception';

export class ProfessorCodeAlreadyExistsException extends ProfessorException {
  readonly statusCode = 409;
  readonly errorKey = 'PROFESSOR_CODE_ALREADY_EXISTS';
  readonly errorCode = 'PROF_002';

  constructor(code: string) {
    super(`Ya existe un profesor registrado con el código ${code}`);
  }
}
