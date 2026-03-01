// modules/course-offerings/application/exceptions/professor-not-active-for-assignment.exception.ts

import { CourseOfferingException } from '@course-offerings/domain/exceptions';

/**
 * Se lanza cuando se intenta asignar un profesor que existe pero no tiene
 * estado ACTIVE. Un profesor INACTIVE u ONLEAVE no puede ser asignado a ofertas.
 */
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
