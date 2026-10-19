import { AcademicPeriodException } from '@academic-periods/domain/exceptions';

export class AcademicPeriodInvalidDateRangeException extends AcademicPeriodException {
  readonly statusCode = 400;
  readonly errorKey = 'ACADEMIC_PERIOD_INVALID_DATE_RANGE';
  readonly errorCode = 'ACP_VALIDATION_001';

  constructor() {
    super('La fecha de fin no puede ser anterior a la fecha de inicio.');
  }
}

export class AcademicPeriodInvalidEnrollmentDateRangeException extends AcademicPeriodException {
  readonly statusCode = 400;
  readonly errorKey = 'ACADEMIC_PERIOD_INVALID_ENROLLMENT_DATE_RANGE';
  readonly errorCode = 'ACP_VALIDATION_002';

  constructor() {
    super(
      'La fecha de fin de inscripción no puede ser anterior a la fecha de inicio de inscripción.',
    );
  }
}
