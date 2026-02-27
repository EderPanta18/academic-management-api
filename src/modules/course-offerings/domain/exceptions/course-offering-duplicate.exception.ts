// modules/course-offerings/domain/exceptions/course-offering-duplicate.exception.ts

import { CourseOfferingException } from './course-offering.exception';

/**
 * Se lanza cuando ya existe una oferta para la misma combinación
 */
export class CourseOfferingDuplicateException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_DUPLICATE';
  readonly errorCode = 'C_OFF_002';

  constructor(courseId: number, academicPeriodId: number, section: string) {
    super(
      `Ya existe una oferta para el curso ${courseId} en el período ${academicPeriodId} con sección '${section}'`,
    );
  }
}
