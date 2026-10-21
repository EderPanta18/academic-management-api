import { EnrollmentException } from '@enrollments/domain/exceptions';

export class EnrollmentNotFoundException extends EnrollmentException {
  readonly statusCode = 404;
  readonly errorKey = 'ENROLLMENT_NOT_FOUND';
  readonly errorCode = 'ENR_QUERY_001';

  constructor(id: string) {
    super(`No se encontró una inscripción con el id "${id}".`);
  }
}
