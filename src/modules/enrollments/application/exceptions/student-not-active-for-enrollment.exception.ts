// modules/enrollments/application/exceptions/student-not-active-for-enrollment.exception.ts

import { EnrollmentException } from "@enrollments/domain/exceptions";

export class StudentNotActiveForEnrollmentException extends EnrollmentException {
  readonly statusCode = 422;
  readonly errorKey = "STUDENT_NOT_ACTIVE_FOR_ENROLLMENT";
  readonly errorCode = "ENR_005";

  constructor(studentId: number) {
    super(
      `El alumno ${studentId} no puede inscribirse porque su estado no es ACTIVE`
    );
  }
}
