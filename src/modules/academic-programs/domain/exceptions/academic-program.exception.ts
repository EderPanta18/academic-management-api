import { DomainException } from '@core/exceptions';

export abstract class AcademicProgramException extends DomainException {
  readonly domain = 'ACADEMIC_PROGRAM';
}
