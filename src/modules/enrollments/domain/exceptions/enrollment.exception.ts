// modules/enrollments/domain/exceptions/enrollment.exception.ts

import { DomainException } from '@core/exceptions';

export abstract class EnrollmentException extends DomainException {
  readonly domain = 'ENROLLMENT';
}
