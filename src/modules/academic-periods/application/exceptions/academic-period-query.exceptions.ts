import { AcademicPeriodException } from '@academic-periods/domain/exceptions';

export class AcademicPeriodNotFoundException extends AcademicPeriodException {
  readonly statusCode = 404;
  readonly errorKey = 'ACADEMIC_PERIOD_NOT_FOUND';
  readonly errorCode = 'ACP_QUERY_001';

  constructor(id: string) {
    super(`No se encontró un periodo académico con el id "${id}".`);
  }
}
