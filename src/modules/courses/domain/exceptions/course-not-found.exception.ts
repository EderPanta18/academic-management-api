// modules/courses/domain/exceptions/course-not-found.exception.ts

import { CourseException } from './course.exception';

export class CourseNotFoundException extends CourseException {
  readonly statusCode = 404;
  readonly errorKey = 'COURSE_NOT_FOUND';
  readonly errorCode = 'COUR_001';

  constructor(id: number) {
    super(`No se encontró un curso con el id ${id}`);
  }
}
