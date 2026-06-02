// modules/students/domain/exceptions/student-not-found.exception.ts

import { StudentException } from "./student.exception";

export class StudentNotFoundException extends StudentException {
  readonly statusCode = 404;
  readonly errorKey = "STUDENT_NOT_FOUND";
  readonly errorCode = "STU_001";

  constructor(id: number) {
    super(`No se encontró un estudiante con el id ${id}`);
  }
}
