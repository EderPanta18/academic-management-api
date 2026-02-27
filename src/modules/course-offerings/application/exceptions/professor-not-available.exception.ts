// modules/course-offerings/presentation/exceptions/professor-not-available.exception.ts

import { CourseOfferingException } from '@course-offerings/domain/exceptions';

/**
 * Se lanza cuando se intenta asignar un profesor que no existe,
 */
export class ProfessorNotAvailableException extends CourseOfferingException {
  readonly statusCode = 422;
  readonly errorKey = 'PROFESSOR_NOT_AVAILABLE';
  readonly errorCode = 'C_OFF_007';

  constructor(professorId: number) {
    super(
      `El profesor con id ${professorId} no está disponible para ser asignado. ` +
        `Debe existir y tener estado ACTIVE`,
    );
  }
}
