import { ProfessorException } from '@professors/domain/exceptions';

export class ProfessorCodeAlreadyExistsException extends ProfessorException {
  readonly statusCode = 409;
  readonly errorKey = 'PROFESSOR_CODE_ALREADY_EXISTS';
  readonly errorCode = 'PROF_UNIQUENESS_001';

  constructor(code: string) {
    super(`Ya existe un profesor registrado con el código "${code}".`);
  }
}

export class ProfessorInstitutionalEmailAlreadyExistsException extends ProfessorException {
  readonly statusCode = 409;
  readonly errorKey = 'PROFESSOR_INSTITUTIONAL_EMAIL_ALREADY_EXISTS';
  readonly errorCode = 'PROF_UNIQUENESS_002';

  constructor(email: string) {
    super(`Ya existe un profesor registrado con el correo institucional "${email}".`);
  }
}
