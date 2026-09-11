import { AcademicProgramException } from '@academic-programs/domain/exception';

export class AcademicProgramNotFoundException extends AcademicProgramException {
  readonly statusCode = 404;
  readonly errorKey = 'ACADEMIC_PROGRAM_NOT_FOUND';
  readonly errorCode = 'ACP_QUERY_001';

  constructor(id: string) {
    super(`Programa académico con id "${id}" no se encontró.`);
  }
}
