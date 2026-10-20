import { DomainException } from '@core/exceptions';

export abstract class CourseOfferingException extends DomainException {
  readonly domain = 'COURSE_OFFERING';
}
