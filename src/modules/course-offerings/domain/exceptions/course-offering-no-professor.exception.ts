// modules/course-offerings/domain/exceptions/course-offering-no-professor.exception.ts

import { CourseOfferingException } from "./course-offering.exception";

export class CourseOfferingNoProfessorException extends CourseOfferingException {
  readonly statusCode = 422;
  readonly errorKey = "COURSE_OFFERING_NO_PROFESSOR";
  readonly errorCode = "C_OFF_004";

  constructor(id: number) {
    super(
      `La oferta ${id} no puede activarse porque no tiene un profesor asignado`
    );
  }
}
