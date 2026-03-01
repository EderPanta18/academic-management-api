// modules/enrollments/domain/exceptions/enrollment-capacity-exceeded.exception.ts

import { EnrollmentException } from './enrollment.exception';

/**
 * Se lanza cuando la oferta ya alcanzó su límite de maxStudents
 * con inscripciones en estado ENROLLED.
 */
export class EnrollmentCapacityExceededException extends EnrollmentException {
  readonly statusCode = 422;
  readonly errorKey = 'ENROLLMENT_CAPACITY_EXCEEDED';
  readonly errorCode = 'ENR_004';

  constructor(courseOfferingId: number) {
    super(
      `La oferta ${courseOfferingId} ya alcanzó su capacidad máxima de alumnos inscritos`,
    );
  }
}
