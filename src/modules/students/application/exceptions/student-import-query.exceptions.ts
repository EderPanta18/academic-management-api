import { StudentImportException } from '@students/domain/exceptions';

export class StudentImportNotFoundException extends StudentImportException {
  readonly statusCode = 404;
  readonly errorKey = 'STUDENT_IMPORT_NOT_FOUND';
  readonly errorCode = 'STI_QUERY_001';

  constructor(id: string) {
    super(`No se encontró una importación con el id "${id}".`);
  }
}
