import type { EnrollmentStatus } from '@enrollments/domain/entities';
import { EnrollmentStatusLogException } from '@enrollments/domain/exceptions';

export class EnrollmentStatusLogSameStatusException extends EnrollmentStatusLogException {
  readonly statusCode = 400;
  readonly errorKey = 'ENROLLMENT_STATUS_LOG_SAME_STATUS';
  readonly errorCode = 'ENR_LOG_VALIDATION_001';

  constructor(status: EnrollmentStatus) {
    super(
      `El estado previo y el nuevo son iguales ("${status}"). Un registro de transición debe capturar un cambio real de estado.`,
    );
  }
}
