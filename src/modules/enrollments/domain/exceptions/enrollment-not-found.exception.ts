// modules/enrollments/domain/exceptions/enrollment-not-found.exception.ts

import { EnrollmentException } from './enrollment.exception';

export class EnrollmentNotFoundException extends EnrollmentException {
  readonly statusCode = 404;
  readonly errorKey = 'ENROLLMENT_NOT_FOUND';
  readonly errorCode = 'ENR_001';

  constructor(id: number) {
    super(`No se encontró una inscripción con el id ${id}`);
  }
}
