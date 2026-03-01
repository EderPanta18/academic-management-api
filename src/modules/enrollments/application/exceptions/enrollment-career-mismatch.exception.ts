// modules/enrollments/application/exceptions/enrollment-career-mismatch.exception.ts

import { EnrollmentException } from '@enrollments/domain/exceptions';

/**
 * Se lanza cuando la carrera del alumno no coincide con la carrera del
 * curso al que pertenece la oferta.
 */
export class EnrollmentCareerMismatchException extends EnrollmentException {
  readonly statusCode = 422;
  readonly errorKey = 'ENROLLMENT_CAREER_MISMATCH';
  readonly errorCode = 'ENR_007';

  constructor(studentId: number, courseOfferingId: number) {
    super(
      `El alumno ${studentId} no puede inscribirse en la oferta ${courseOfferingId}: ` +
        `el curso pertenece a una carrera distinta a la del alumno`,
    );
  }
}
