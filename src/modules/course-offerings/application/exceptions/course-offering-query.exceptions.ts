import { CourseOfferingException } from '@course-offerings/domain/exceptions';

export class CourseOfferingNotFoundException extends CourseOfferingException {
  readonly statusCode = 404;
  readonly errorKey = 'COURSE_OFFERING_NOT_FOUND';
  readonly errorCode = 'COF_QUERY_001';

  constructor(id: string) {
    super(`No se encontró una oferta de curso con el id "${id}".`);
  }
}
