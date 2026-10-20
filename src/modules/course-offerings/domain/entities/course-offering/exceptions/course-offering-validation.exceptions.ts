import { CourseOfferingException } from '@course-offerings/domain/exceptions';

export class CourseOfferingInvalidCapacityException extends CourseOfferingException {
  readonly statusCode = 400;
  readonly errorKey = 'COURSE_OFFERING_INVALID_CAPACITY';
  readonly errorCode = 'COF_VALIDATION_001';

  constructor(capacity: number) {
    super(`El cupo máximo debe ser mayor que cero. Se recibió "${capacity}".`);
  }
}

export class CourseOfferingInvalidAvailableCapacityException extends CourseOfferingException {
  readonly statusCode = 400;
  readonly errorKey = 'COURSE_OFFERING_INVALID_AVAILABLE_CAPACITY';
  readonly errorCode = 'COF_VALIDATION_002';

  constructor(availableCapacity: number, maxCapacity: number) {
    super(
      `El cupo disponible (${availableCapacity}) no puede ser negativo ni superar el cupo máximo (${maxCapacity}).`,
    );
  }
}

export class CourseOfferingInvalidSectionException extends CourseOfferingException {
  readonly statusCode = 400;
  readonly errorKey = 'COURSE_OFFERING_INVALID_SECTION';
  readonly errorCode = 'COF_VALIDATION_003';

  constructor(section: string, minLength: number, maxLength: number) {
    super(
      `La sección "${section}" no es válida. Debe tener entre ${minLength} y ${maxLength} caracteres.`,
    );
  }
}
