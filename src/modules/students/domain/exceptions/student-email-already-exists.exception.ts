// modules/students/domain/exceptions/student-email-already-exists.exception.ts

import { StudentException } from "./student.exception";

export class StudentEmailAlreadyExistsException extends StudentException {
  readonly statusCode = 409;
  readonly errorKey = "STUDENT_EMAIL_ALREADY_EXISTS";
  readonly errorCode = "STU_003";

  constructor(email: string) {
    super(
      `Ya existe un estudiante registrado con el email institucional ${email}`
    );
  }
}
