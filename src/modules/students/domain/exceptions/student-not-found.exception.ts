// modules/students/domain/exceptions/student-not-found.exception.ts

import { StudentException } from './student.exception';

/**
 * Se lanza cuando se busca un estudiante por id
 * y no existe o fue dado de baja (soft-delete).
 */
export class StudentNotFoundException extends StudentException {
  readonly statusCode = 404;
  readonly errorKey = 'STUDENT_NOT_FOUND';
  readonly errorCode = 'STU_001';

  constructor(id: number) {
    super(`No se encontró un estudiante con el id ${id}`);
  }
}
