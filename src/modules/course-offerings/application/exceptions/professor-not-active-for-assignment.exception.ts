// modules/course-offerings/application/exceptions/professor-not-active-for-assignment.exception.ts

import { CourseOfferingException } from '@course-offerings/domain/exceptions';

export class ProfessorNotActiveForAssignmentException extends CourseOfferingException {
  readonly statusCode = 422;
  readonly errorKey = 'PROFESSOR_NOT_ACTIVE_FOR_ASSIGNMENT';
  readonly errorCode = 'C_OFF_007';

  constructor(professorId: number) {
    super(
      `El profesor con id ${professorId} no puede ser asignado. ` +
        `Debe tener estado ACTIVE para ser asignado a una oferta.`,
    );
  }
}
