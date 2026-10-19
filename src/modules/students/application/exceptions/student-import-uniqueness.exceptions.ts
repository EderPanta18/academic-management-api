import { StudentException } from '@students/domain/exceptions';

export class StudentImportFileAlreadyExistsException extends StudentException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_IMPORT_FILE_ALREADY_EXISTS';
  readonly errorCode = 'STI_UNIQUENESS_001';

  constructor(userId: string, fileName: string) {
    super(
      `Ya existe una importación registrada con el archivo "${fileName}" para el usuario con id "${userId}".`,
    );
  }
}
