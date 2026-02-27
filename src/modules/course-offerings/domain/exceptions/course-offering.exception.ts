// modules/course-offerings/domain/exceptions/course-offering.exception.ts

import { DomainException } from '@shared/domain/exceptions';

/**
 * Clase base de todas las excepciones del módulo course-offerings.
 */
export abstract class CourseOfferingException extends DomainException {
  readonly domain = 'COURSE_OFFERING';
}
