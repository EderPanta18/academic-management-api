// modules/enrollments/domain/exceptions/enrollment-invalid-status-transition.exception.ts

import { EnrollmentStatus } from '../constants';
import { EnrollmentException } from './enrollment.exception';

/**
 * Se lanza cuando se intenta una transición de estado no permitida.
 * Ejemplos inválidos: COMPLETED → ENROLLED, WITHDRAWN → SUSPENDED.
 */
export class EnrollmentInvalidStatusTransitionException extends EnrollmentException {
  readonly statusCode = 422;
  readonly errorKey = 'ENROLLMENT_INVALID_STATUS_TRANSITION';
  readonly errorCode = 'EN_003';

  constructor(
    id: number,
    currentStatus: EnrollmentStatus,
    ...allowedStatuses: EnrollmentStatus[]
  ) {
    super(
      `La inscripción ${id} está en estado ${currentStatus}. ` +
        `Se requiere uno de: ${allowedStatuses.join(', ')}`,
    );
  }
}
