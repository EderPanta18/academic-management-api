import { StudentException } from '@students/domain/exceptions';

export class StudentNotFoundException extends StudentException {
  readonly statusCode = 404;
  readonly errorKey = 'STUDENT_NOT_FOUND';
  readonly errorCode = 'STU_QUERY_001';

  constructor(id: string) {
    super(`No se encontró un estudiante con el id "${id}".`);
  }
}
