import { ProfessorException } from '@professors/domain/exceptions';

export class ProfessorNotFoundException extends ProfessorException {
  readonly statusCode = 404;
  readonly errorKey = 'PROFESSOR_NOT_FOUND';
  readonly errorCode = 'PROF_QUERY_001';

  constructor(id: string) {
    super(`No se encontró un profesor con el id "${id}".`);
  }
}
