import { StudentException } from '@students/domain/exceptions';

export class StudentCodeAlreadyExistsException extends StudentException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_CODE_ALREADY_EXISTS';
  readonly errorCode = 'STU_UNIQUENESS_001';

  constructor(code: string) {
    super(`Ya existe un estudiante registrado con el código "${code}".`);
  }
}

export class StudentInstitutionalEmailAlreadyExistsException extends StudentException {
  readonly statusCode = 409;
  readonly errorKey = 'STUDENT_INSTITUTIONAL_EMAIL_ALREADY_EXISTS';
  readonly errorCode = 'STU_UNIQUENESS_002';

  constructor(email: string) {
    super(`Ya existe un estudiante registrado con el correo institucional "${email}".`);
  }
}
