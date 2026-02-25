// modules/professors/domain/exceptions/professor-dni-already-exists.exception.ts

import { ProfessorException } from './professor.exception';

/**
 * Se lanza cuando se intenta registrar un profesor con un DNI
 * que ya pertenece a otro profesor existente en el sistema.
 */
export class ProfessorDniAlreadyExistsException extends ProfessorException {
  readonly statusCode = 409;
  readonly errorKey = 'PROFESSOR_DNI_ALREADY_EXISTS';
  readonly errorCode = 'PROF_001';

  constructor(dni: string) {
    super(`Ya existe un profesor registrado con el DNI ${dni}`);
  }
}
