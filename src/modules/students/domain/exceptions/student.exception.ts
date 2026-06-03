// modules/students/domain/exceptions/student.exception.ts

import { DomainException } from '@core/exceptions';

export abstract class StudentException extends DomainException {
  readonly domain = 'STUDENT';
}
