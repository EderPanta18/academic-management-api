import { EnrollmentException } from '@enrollments/domain/exceptions';

export class EnrollmentStudentAlreadyEnrolledException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_STUDENT_ALREADY_ENROLLED';
  readonly errorCode = 'ENR_UNIQUENESS_001';

  constructor(studentId: string, courseOfferingId: string) {
    super(
      `El estudiante con id "${studentId}" ya tiene una inscripción registrada en la oferta con id "${courseOfferingId}".`,
    );
  }
}
