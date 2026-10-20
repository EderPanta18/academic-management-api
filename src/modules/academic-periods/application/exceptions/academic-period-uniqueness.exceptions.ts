import { AcademicPeriodException } from '@academic-periods/domain/exceptions';

export class AcademicPeriodCodeAlreadyExistsException extends AcademicPeriodException {
  readonly statusCode = 409;
  readonly errorKey = 'ACADEMIC_PERIOD_CODE_ALREADY_EXISTS';
  readonly errorCode = 'ACP_UNIQUENESS_001';

  constructor(code: string) {
    super(`Ya existe un periodo académico registrado con el código "${code}".`);
  }
}
