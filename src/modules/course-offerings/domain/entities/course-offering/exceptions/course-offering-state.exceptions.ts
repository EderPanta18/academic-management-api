import { CourseOfferingException } from '@course-offerings/domain/exceptions';
import type { CourseOfferingStatus } from '../course-offering.enums';

export class CourseOfferingNotOpenableException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_NOT_OPENABLE';
  readonly errorCode = 'COF_STATE_001';

  constructor(id: string, current: CourseOfferingStatus) {
    super(
      `La oferta de curso "${id}" está en estado "${current}" y solo puede abrirse desde "DRAFT".`,
    );
  }
}

export class CourseOfferingCannotOpenWithoutProfessorException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_CANNOT_OPEN_WITHOUT_PROFESSOR';
  readonly errorCode = 'COF_STATE_002';

  constructor(id: string) {
    super(`La oferta de curso "${id}" no puede abrirse porque no tiene un profesor asignado.`);
  }
}

export class CourseOfferingNotClosableException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_NOT_CLOSABLE';
  readonly errorCode = 'COF_STATE_003';

  constructor(id: string, current: CourseOfferingStatus) {
    super(
      `La oferta de curso "${id}" está en estado "${current}" y solo puede cerrarse desde "OPEN".`,
    );
  }
}

export class CourseOfferingNotFinishableException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_NOT_FINISHABLE';
  readonly errorCode = 'COF_STATE_004';

  constructor(id: string, current: CourseOfferingStatus) {
    super(
      `La oferta de curso "${id}" está en estado "${current}" y solo puede finalizarse desde "CLOSED".`,
    );
  }
}

export class CourseOfferingNotCancellableException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_NOT_CANCELLABLE';
  readonly errorCode = 'COF_STATE_005';

  constructor(id: string, current: CourseOfferingStatus) {
    super(
      `La oferta de curso "${id}" está en estado "${current}" y no puede cancelarse. Solo puede cancelarse desde "DRAFT", "OPEN" o "CLOSED".`,
    );
  }
}

export class CourseOfferingNotAssignableException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_NOT_ASSIGNABLE';
  readonly errorCode = 'COF_STATE_006';

  constructor(id: string, current: CourseOfferingStatus) {
    super(
      `La oferta de curso "${id}" está en estado "${current}" y no permite asignación de profesor. Solo se permite en "DRAFT" u "OPEN".`,
    );
  }
}
