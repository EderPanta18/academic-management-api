// modules/course-offerings/application/exceptions/academic-period-not-current.exception.ts

import { CourseOfferingException } from '@course-offerings/domain/exceptions';

/**
 * Se lanza cuando se intenta crear una oferta en un período académico
 * que existe pero no está marcado como vigente (isCurrent = false).
 * Solo se pueden crear ofertas en el período académico actual.
 */
export class AcademicPeriodNotCurrentException extends CourseOfferingException {
  readonly statusCode = 422;
  readonly errorKey = 'ACADEMIC_PERIOD_NOT_CURRENT';
  readonly errorCode = 'CO_005';

  constructor(academicPeriodId: number) {
    super(
      `El período académico ${academicPeriodId} no es el período vigente. ` +
        `Solo se pueden crear ofertas en el período actual`,
    );
  }
}
