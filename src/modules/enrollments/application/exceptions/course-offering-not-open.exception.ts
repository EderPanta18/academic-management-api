// modules/enrollments/application/exceptions/course-offering-not-open.exception.ts

import { EnrollmentException } from '@enrollments/domain/exceptions';

export class CourseOfferingNotOpenException extends EnrollmentException {
  readonly statusCode = 422;
  readonly errorKey = 'COURSE_OFFERING_NOT_OPEN';
  readonly errorCode = 'ENR_006';

  constructor(courseOfferingId: number) {
    super(
      `La oferta ${courseOfferingId} no está abierta para inscripciones. ` +
        `Debe estar en estado ACTIVE y dentro del plazo de matrícula`,
    );
  }
}
