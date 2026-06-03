// modules/course-offerings/domain/exceptions/course-offering-not-found.exception.ts

import { CourseOfferingException } from "./course-offering.exception";

export class CourseOfferingNotFoundException extends CourseOfferingException {
  readonly statusCode = 404;
  readonly errorKey = "COURSE_OFFERING_NOT_FOUND";
  readonly errorCode = "C_OFF_001";

  constructor(id: number) {
    super(`No se encontró una oferta de curso con el id ${id}`);
  }
}
