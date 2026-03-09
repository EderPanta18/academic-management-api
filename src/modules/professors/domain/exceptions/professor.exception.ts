// modules/professors/domain/exceptions/professor.exception.ts

import { DomainException } from '@core/domain/exceptions';

/**
 * Clase base de todas las excepciones del módulo professors.
 */
export abstract class ProfessorException extends DomainException {
  readonly domain = 'PROFESSOR';
}
