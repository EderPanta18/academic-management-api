// modules/course-offerings/domain/exceptions/course-offering-invalid-status.exception.ts

import { CourseOfferingException } from './course-offering.exception';
import { CourseOfferingStatus } from '../constants';

/**
 * Se lanza cuando se intenta realizar una operación sobre una oferta
 * cuyo estado no lo permite (ej: asignar profesor a una oferta CANCELLED).
 */
export class CourseOfferingInvalidStatusException extends CourseOfferingException {
  readonly statusCode = 422;
  readonly errorKey = 'COURSE_OFFERING_INVALID_STATUS';
  readonly errorCode = 'C_OFF_003';

  constructor(
    id: number,
    currentStatus: CourseOfferingStatus,
    requiredStatuses: CourseOfferingStatus[],
  ) {
    super(
      `La oferta ${id} está en estado '${currentStatus}'. ` +
        `Se requiere uno de: ${requiredStatuses.join(', ')}`,
    );
  }
}
