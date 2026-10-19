import { DomainException } from '@core/exceptions';

export abstract class CourseException extends DomainException {
  readonly domain = 'COURSE';

  readonly entity: string = 'course';
}
