// modules/enrollments/domain/exceptions/enrollment-duplicate.exception.ts

import { EnrollmentException } from './enrollment.exception';

export class EnrollmentDuplicateException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_DUPLICATE';
  readonly errorCode = 'ENR_002';

  constructor(studentId: number, courseOfferingId: number) {
    super(`El alumno ${studentId} ya está inscrito en la oferta ${courseOfferingId}`);
  }
}
