// modules/enrollments/domain/exceptions/enrollment.exception.ts

import { DomainException } from '@shared/domain/exceptions';

/** Clase base de todas las excepciones del módulo enrollments. */
export abstract class EnrollmentException extends DomainException {
  readonly domain = 'ENROLLMENT';
}
