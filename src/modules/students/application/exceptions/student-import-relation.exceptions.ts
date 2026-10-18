import { StudentException } from '@modules/students/domain/exceptions';

export class StudentImportAcademicProgramCodeNotFoundException extends StudentException {
  readonly statusCode = 404;
  readonly errorKey = 'STUDENT_IMPORT_ACADEMIC_PROGRAM_CODE_NOT_FOUND';
  readonly errorCode = 'STI_RELATION_001';

  constructor(academicProgramCode: string) {
    super(`No se encontró el programa académico con el código "${academicProgramCode}".`);
  }
}

export class StudentImportDocumentTypeCodeNotFoundException extends StudentException {
  readonly statusCode = 404;
  readonly errorKey = 'STUDENT_IMPORT_DOCUMENT_TYPE_NOT_FOUND';
  readonly errorCode = 'STI_RELATION_002';

  constructor(documentTypeCode: string) {
    super(`No se encontró el tipo de documento con el código "${documentTypeCode}".`);
  }
}

export class StudentImportUserNotFoundException extends StudentException {
  readonly statusCode = 404;
  readonly errorKey = 'STUDENT_IMPORT_USER_NOT_FOUND';
  readonly errorCode = 'STI_RELATION_003';

  constructor(userId: string) {
    super(`No se encontró el usuario con el id "${userId}".`);
  }
}
