// modules/students/domain/exceptions/student-code-already-exists.exception.ts

import { StudentException } from './student.exception';

export class StudentCodeAlreadyExistsException extends StudentException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_CODE_ALREADY_EXISTS';
  readonly errorCode = 'STU_002';

  constructor(code: string) {
    super(`Ya existe un estudiante registrado con el código ${code}`);
  }
}
