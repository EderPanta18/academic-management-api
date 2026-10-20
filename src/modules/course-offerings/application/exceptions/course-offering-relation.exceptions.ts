import { CourseOfferingException } from '@course-offerings/domain/exceptions';

export class CourseOfferingCourseNotFoundException extends CourseOfferingException {
  readonly statusCode = 404;
  readonly errorKey = 'COURSE_OFFERING_COURSE_NOT_FOUND';
  readonly errorCode = 'COF_RELATION_001';

  constructor(courseId: string) {
    super(`No se encontró el curso con el id "${courseId}".`);
  }
}

export class CourseOfferingAcademicPeriodNotFoundException extends CourseOfferingException {
  readonly statusCode = 404;
  readonly errorKey = 'COURSE_OFFERING_ACADEMIC_PERIOD_NOT_FOUND';
  readonly errorCode = 'COF_RELATION_002';

  constructor(academicPeriodId: string) {
    super(`No se encontró el periodo académico con el id "${academicPeriodId}".`);
  }
}

export class CourseOfferingProfessorNotFoundException extends CourseOfferingException {
  readonly statusCode = 404;
  readonly errorKey = 'COURSE_OFFERING_PROFESSOR_NOT_FOUND';
  readonly errorCode = 'COF_RELATION_003';

  constructor(professorId: string) {
    super(`No se encontró el profesor con el id "${professorId}".`);
  }
}

export class CourseOfferingAcademicPeriodNotOpenException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_ACADEMIC_PERIOD_NOT_OPEN';
  readonly errorCode = 'COF_RELATION_004';

  constructor(academicPeriodId: string) {
    super(
      `El periodo académico con id "${academicPeriodId}" no está en estado "OPEN". Debe estar abierto para aceptar ofertas de curso.`,
    );
  }
}

export class CourseOfferingProfessorNotActiveException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_PROFESSOR_NOT_ACTIVE';
  readonly errorCode = 'COF_RELATION_005';

  constructor(professorId: string, courseOfferingId?: string) {
    super(
      courseOfferingId
        ? `El profesor con id "${professorId}" no está activo y no puede ser asignado a la oferta con id "${courseOfferingId}".`
        : `El profesor con id "${professorId}" no está activo y no puede ser asignado como docente a una nueva oferta de curso.`,
    );
  }
}
