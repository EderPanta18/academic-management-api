// modules/course-offerings/domain/exceptions/course-offering-invalid-status.exception.ts

import { CourseOfferingStatus } from '../constants';
import { CourseOfferingException } from './course-offering.exception';

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
