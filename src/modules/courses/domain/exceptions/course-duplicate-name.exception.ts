// modules/courses/domain/exceptions/course-duplicate-name.exception.ts

import { CourseException } from './course.exception';

/**
 * Se lanza cuando ya existe un curso con el mismo nombre
 * dentro de la misma carrera.
 */
export class CourseDuplicateNameException extends CourseException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_DUPLICATE_NAME';
  readonly errorCode = 'COUR_002';

  constructor(name: string, careerId: number) {
    super(
      `Ya existe un curso con el nombre "${name}" en la carrera con id ${careerId}`,
    );
  }
}
