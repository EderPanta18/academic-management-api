import { StudentImportException } from '@students/domain/exceptions';

export class StudentImportEmptyException extends StudentImportException {
  readonly statusCode = 400;
  readonly errorKey = 'STUDENT_IMPORT_EMPTY';
  readonly errorCode = 'STI_VALIDATION_001';

  constructor() {
    super(`La importación debe tener al menos 1 fila.`);
  }
}

export class StudentImportTooManyRowsException extends StudentImportException {
  readonly statusCode = 400;
  readonly errorKey = 'STUDENT_IMPORT_TOO_MANY_ROWS';
  readonly errorCode = 'STI_VALIDATION_002';

  constructor(actual: number, max: number) {
    super(`La importación tiene ${actual} filas y el máximo permitido es ${max}.`);
  }
}
