import type { StudentImportStatus } from '@students/domain/enums';
import { StudentImportException } from '@students/domain/exceptions';

export class StudentImportNotPendingException extends StudentImportException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_IMPORT_NOT_PENDING';
  readonly errorCode = 'STI_STATE_001';

  constructor(id: string, current: StudentImportStatus) {
    super(
      `La importación "${id}" está en estado "${current}" y solo puede procesarse si está en "PENDING".`,
    );
  }
}

export class StudentImportNotProcessingException extends StudentImportException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_IMPORT_NOT_PROCESSING';
  readonly errorCode = 'STI_STATE_002';

  constructor(id: string, current: StudentImportStatus) {
    super(
      `La importación "${id}" está en estado "${current}" y solo puede finalizarse si está en "PROCESSING".`,
    );
  }
}

export class StudentImportCannotFailException extends StudentImportException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_IMPORT_CANNOT_FAIL';
  readonly errorCode = 'STI_STATE_003';

  constructor(id: string, current: StudentImportStatus) {
    super(
      `La importación "${id}" está en estado "${current}" y no puede marcarse como fallida. Solo puede fallar desde "PENDING" o "PROCESSING".`,
    );
  }
}
