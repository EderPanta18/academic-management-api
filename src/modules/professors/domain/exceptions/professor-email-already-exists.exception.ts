// modules/professors/domain/exceptions/professor-dni-already-exists.exception.ts

import { ProfessorException } from './professor.exception';

/**
 * Se lanza cuando se intenta registrar un profesor con un email
 * que ya pertenece a otro profesor existente en el sistema.
 */
export class ProfessorEmailAlreadyExistsException extends ProfessorException {
  readonly statusCode = 409;
  readonly errorKey = 'PROFESSOR_EMAIL_ALREADY_EXISTS';
  readonly errorCode = 'PROF_003';

  constructor(email: string) {
    super(`Ya existe una persona registrada con el email ${email}`);
  }
}
