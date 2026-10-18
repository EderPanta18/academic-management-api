import { AcademicProgramException } from '@modules/academic-programs/domain/exceptions';

export class AcademicProgramCodeAlreadyExistsException extends AcademicProgramException {
  readonly statusCode = 409;
  readonly errorKey = 'ACADEMIC_PROGRAM_CODE_ALREADY_EXISTS';
  readonly errorCode = 'ACP_UNIQUENESS_001';

  constructor(code: string) {
    super(`Ya existe un programa académico con el código "${code}".`);
  }
}

export class AcademicProgramNameAlreadyExistsException extends AcademicProgramException {
  readonly statusCode = 409;
  readonly errorKey = 'ACADEMIC_PROGRAM_NAME_ALREADY_EXISTS';
  readonly errorCode = 'ACP_UNIQUENESS_002';

  constructor(name: string) {
    super(`Ya existe un programa académico con el nombre "${name}".`);
  }
}
