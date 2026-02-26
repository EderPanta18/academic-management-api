// modules/students/domain/exceptions/student.exception.ts

import { DomainException } from '@shared/domain/exceptions';

/**
 * Clase base de todas las excepciones del módulo students.
 */
export abstract class StudentException extends DomainException {
  readonly domain = 'STUDENT';
}
