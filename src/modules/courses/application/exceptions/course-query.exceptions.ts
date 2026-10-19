import { CourseException } from '@courses/domain/exceptions';

export class CourseNotFoundException extends CourseException {
  readonly statusCode = 404;
  readonly errorKey = 'COURSE_NOT_FOUND';
  readonly errorCode = 'COUR_QUERY_001';

  constructor(id: string) {
    super(`No se encontró un curso con el id "${id}".`);
  }
}
