// modules/courses/domain/exceptions/course.exception.ts

import { DomainException } from '@core/domain/exceptions';

export abstract class CourseException extends DomainException {
  readonly domain = 'COURSE';
}
