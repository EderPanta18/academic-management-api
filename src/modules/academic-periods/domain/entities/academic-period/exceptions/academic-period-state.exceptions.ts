import { AcademicPeriodException } from '@academic-periods/domain/exceptions';
import type { AcademicPeriodStatus } from '../academic-period.enums';

export class AcademicPeriodNotOpenableException extends AcademicPeriodException {
  readonly statusCode = 409;
  readonly errorKey = 'ACADEMIC_PERIOD_NOT_OPENABLE';
  readonly errorCode = 'ACP_STATE_001';

  constructor(id: string, current: AcademicPeriodStatus) {
    super(
      `El periodo académico "${id}" está en estado "${current}" y solo puede abrirse desde "PLANNED".`,
    );
  }
}

export class AcademicPeriodNotStartableException extends AcademicPeriodException {
  readonly statusCode = 409;
  readonly errorKey = 'ACADEMIC_PERIOD_NOT_STARTABLE';
  readonly errorCode = 'ACP_STATE_002';

  constructor(id: string, current: AcademicPeriodStatus) {
    super(
      `El periodo académico "${id}" está en estado "${current}" y solo puede iniciarse desde "OPEN".`,
    );
  }
}

export class AcademicPeriodNotClosableException extends AcademicPeriodException {
  readonly statusCode = 409;
  readonly errorKey = 'ACADEMIC_PERIOD_NOT_CLOSABLE';
  readonly errorCode = 'ACP_STATE_003';

  constructor(id: string, current: AcademicPeriodStatus) {
    super(
      `El periodo académico "${id}" está en estado "${current}" y solo puede cerrarse desde "OPEN" o "IN_PROGRESS".`,
    );
  }
}

export class AcademicPeriodNotCancellableException extends AcademicPeriodException {
  readonly statusCode = 409;
  readonly errorKey = 'ACADEMIC_PERIOD_NOT_CANCELLABLE';
  readonly errorCode = 'ACP_STATE_004';

  constructor(id: string, current: AcademicPeriodStatus) {
    super(
      `El periodo académico "${id}" está en estado "${current}" y no puede cancelarse. Solo puede cancelarse desde "PLANNED", "OPEN" o "IN_PROGRESS".`,
    );
  }
}
