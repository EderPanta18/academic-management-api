import { DomainException } from '@core/exceptions';

export abstract class StudentException extends DomainException {
  readonly domain = 'STUDENT';

  readonly entity: string = 'student';
}
