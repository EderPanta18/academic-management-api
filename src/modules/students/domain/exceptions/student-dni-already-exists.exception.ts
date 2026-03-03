// modules/students/domain/exceptions/student-dni-already-exists.exception.ts

import { StudentException } from './student.exception';

/**
 * Se lanza cuando se intenta registrar un estudiante con un DNI
 * que ya pertenece a otro estudiante existente.
 */
export class StudentDniAlreadyExistsException extends StudentException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_DNI_ALREADY_EXISTS';
  readonly errorCode = 'STU_002';

  constructor(dni: string) {
    super(`Ya existe un estudiante registrado con el DNI ${dni}`);
  }
}
