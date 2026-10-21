import { EnrollmentException } from '@enrollments/domain/exceptions';

export class EnrollmentStudentNotFoundException extends EnrollmentException {
  readonly statusCode = 404;
  readonly errorKey = 'ENROLLMENT_STUDENT_NOT_FOUND';
  readonly errorCode = 'ENR_RELATION_001';

  constructor(studentId: string) {
    super(`No se encontró el estudiante con el id "${studentId}".`);
  }
}

export class EnrollmentCourseOfferingNotFoundException extends EnrollmentException {
  readonly statusCode = 404;
  readonly errorKey = 'ENROLLMENT_COURSE_OFFERING_NOT_FOUND';
  readonly errorCode = 'ENR_RELATION_002';

  constructor(courseOfferingId: string) {
    super(`No se encontró la oferta de curso con el id "${courseOfferingId}".`);
  }
}

export class EnrollmentStudentNotActiveException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_STUDENT_NOT_ACTIVE';
  readonly errorCode = 'ENR_RELATION_003';

  constructor(studentId: string) {
    super(`El estudiante con id "${studentId}" no está activo y no puede inscribirse.`);
  }
}

export class EnrollmentCourseOfferingNotOpenException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_COURSE_OFFERING_NOT_OPEN';
  readonly errorCode = 'ENR_RELATION_004';

  constructor(courseOfferingId: string) {
    super(
      `La oferta de curso con id "${courseOfferingId}" no está abierta y no acepta inscripciones.`,
    );
  }
}

export class EnrollmentStudentNotInCourseAcademicProgramException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_STUDENT_NOT_IN_COURSE_ACADEMIC_PROGRAM';
  readonly errorCode = 'ENR_RELATION_005';

  constructor(studentId: string, courseAcademicProgramId: string) {
    super(
      `El estudiante con id "${studentId}" no pertenece al programa académico con id "${courseAcademicProgramId}", al que pertenece el curso de la oferta.`,
    );
  }
}

export class EnrollmentCourseOfferingAtCapacityException extends EnrollmentException {
  readonly statusCode = 409;
  readonly errorKey = 'ENROLLMENT_COURSE_OFFERING_AT_CAPACITY';
  readonly errorCode = 'ENR_RELATION_006';

  constructor(courseOfferingId: string) {
    super(
      `La oferta de curso con id "${courseOfferingId}" alcanzó su cupo máximo y no acepta nuevas inscripciones activas.`,
    );
  }
}
