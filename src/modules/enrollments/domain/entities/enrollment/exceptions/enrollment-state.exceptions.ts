import { EnrollmentException } from '@enrollments/domain/exceptions';
import type { EnrollmentStatus } from '../enrollment.enums';

export class EnrollmentNotConfirmableException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_NOT_CONFIRMABLE';
  readonly errorCode = 'ENR_STATE_001';

  constructor(id: string, current: EnrollmentStatus) {
    super(
      `La inscripción "${id}" está en estado "${current}" y solo puede confirmarse desde "PENDING".`,
    );
  }
}

export class EnrollmentNotCancellableException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_NOT_CANCELLABLE';
  readonly errorCode = 'ENR_STATE_002';

  constructor(id: string, current: EnrollmentStatus) {
    super(
      `La inscripción "${id}" está en estado "${current}" y solo puede cancelarse desde "PENDING" o "ENROLLED".`,
    );
  }
}

export class EnrollmentNotWithdrawableException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_NOT_WITHDRAWABLE';
  readonly errorCode = 'ENR_STATE_003';

  constructor(id: string, current: EnrollmentStatus) {
    super(
      `La inscripción "${id}" está en estado "${current}" y solo puede retirarse desde "ENROLLED".`,
    );
  }
}

export class EnrollmentNotRejectableException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_NOT_REJECTABLE';
  readonly errorCode = 'ENR_STATE_004';

  constructor(id: string, current: EnrollmentStatus) {
    super(
      `La inscripción "${id}" está en estado "${current}" y solo puede rechazarse desde "PENDING".`,
    );
  }
}

export class EnrollmentNotFinishableException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_NOT_FINISHABLE';
  readonly errorCode = 'ENR_STATE_005';

  constructor(id: string, current: EnrollmentStatus) {
    super(
      `La inscripción "${id}" está en estado "${current}" y solo puede finalizarse desde "ENROLLED".`,
    );
  }
}
