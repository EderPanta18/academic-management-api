import { CourseException } from '@courses/domain/exceptions';

export class CourseAcademicProgramNotFoundException extends CourseException {
  readonly statusCode = 404;
  readonly errorKey = 'COURSE_ACADEMIC_PROGRAM_NOT_FOUND';
  readonly errorCode = 'COUR_RELATION_001';

  constructor(academicProgramId: string) {
    super(`No se encontró el programa académico con el id "${academicProgramId}".`);
  }
}

export class CourseCategoryNotFoundException extends CourseException {
  readonly statusCode = 404;
  readonly errorKey = 'COURSE_CATEGORY_NOT_FOUND';
  readonly errorCode = 'COUR_RELATION_002';

  constructor(courseCategoryId: string) {
    super(`No se encontró la categoría de curso con el id "${courseCategoryId}".`);
  }
}
