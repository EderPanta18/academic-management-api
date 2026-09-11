import { AcademicProgramException } from '@academic-programs/domain/exception';

export class AcademicProgramCodeAlreadyExistsException extends AcademicProgramException {
  readonly statusCode = 409;
  readonly errorKey = 'ACADEMIC_PROGRAM_CODE_ALREADY_EXISTS';
  readonly errorCode = 'ACP_UNIQUENESS_001';

  constructor(code: string) {
    super(`Programa académico con código "${code}" ya existe.`);
  }
}

export class AcademicProgramNameAlreadyExistsException extends AcademicProgramException {
  readonly statusCode = 409;
  readonly errorKey = 'ACADEMIC_PROGRAM_NAME_ALREADY_EXISTS';
  readonly errorCode = 'ACP_UNIQUENESS_002';

  constructor(name: string) {
    super(`Programa académico con nombre "${name}" ya existe.`);
  }
}
