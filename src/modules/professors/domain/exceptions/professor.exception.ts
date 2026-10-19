import { DomainException } from '@core/exceptions';

export abstract class ProfessorException extends DomainException {
  readonly domain = 'PROFESSOR';
}
