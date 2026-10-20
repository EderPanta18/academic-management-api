import { DomainException } from '@core/exceptions';

export abstract class EnrollmentException extends DomainException {
  readonly domain = 'ENROLLMENT';

  readonly entity: string = 'enrollment';
}
