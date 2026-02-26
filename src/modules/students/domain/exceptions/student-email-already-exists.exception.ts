// modules/students/domain/exceptions/student-email-already-exists.exception.ts

import { StudentException } from './student.exception';

/**
 * Se lanza cuando se intenta registrar un estudiante con un email
 * que ya pertenece a otro estudiante existente.
 */
export class StudentEmailAlreadyExistsException extends StudentException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_EMAIL_ALREADY_EXISTS';
  readonly errorCode = 'STU_004';

  constructor(email: string) {
    super(`Ya existe un estudiante registrado con el email ${email}`);
  }
}
