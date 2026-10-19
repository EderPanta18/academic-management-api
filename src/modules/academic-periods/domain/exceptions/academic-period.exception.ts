import { DomainException } from '@core/exceptions';

export abstract class AcademicPeriodException extends DomainException {
  readonly domain = 'ACADEMIC_PERIOD';
}
