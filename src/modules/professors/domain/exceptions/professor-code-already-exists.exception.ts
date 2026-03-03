// modules/professors/domain/exceptions/professor-code-already-exists.exception.ts

import { ProfessorException } from './professor.exception';

/**
 * Se lanza cuando se intenta registrar un profesor con un código
 * que ya pertenece a otro profesor en el sistema.
 */
export class ProfessorCodeAlreadyExistsException extends ProfessorException {
  readonly statusCode = 409;
  readonly errorKey = 'PROFESSOR_CODE_ALREADY_EXISTS';
  readonly errorCode = 'PROF_004';

  constructor(code: string) {
    super(`Ya existe un profesor registrado con el código ${code}`);
  }
}
