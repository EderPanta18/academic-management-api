// modules/professors/domain/exceptions/professor-email-already-exists.exception.ts

import { ProfessorException } from './professor.exception';

export class ProfessorEmailAlreadyExistsException extends ProfessorException {
  readonly statusCode = 409;
  readonly errorKey = 'PROFESSOR_EMAIL_ALREADY_EXISTS';
  readonly errorCode = 'PROF_003';

  constructor(email: string) {
    super(`Ya existe un profesor registrado con el email institucional ${email}`);
  }
}
