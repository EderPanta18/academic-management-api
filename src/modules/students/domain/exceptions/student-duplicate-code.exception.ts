// modules/students/domain/exceptions/student-duplicate-code.exception.ts

import { StudentException } from './student.exception';

/**
 * Se lanza cuando se intenta registrar un estudiante con un código
 * académico que ya pertenece a otro estudiante existente.
 */
export class StudentDuplicateCodeException extends StudentException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_DUPLICATE_CODE';
  readonly errorCode = 'STU_002';

  constructor(code: string) {
    super(`Ya existe un estudiante registrado con el código ${code}`);
  }
}
