// modules/enrollments/domain/exceptions/enrollment-capacity-exceeded.exception.ts

import { EnrollmentException } from "./enrollment.exception";

export class EnrollmentCapacityExceededException extends EnrollmentException {
  readonly statusCode = 422;
  readonly errorKey = "ENROLLMENT_CAPACITY_EXCEEDED";
  readonly errorCode = "ENR_004";

  constructor(courseOfferingId: number) {
    super(
      `La oferta ${courseOfferingId} ya alcanzó su capacidad máxima de alumnos inscritos`
    );
  }
}
