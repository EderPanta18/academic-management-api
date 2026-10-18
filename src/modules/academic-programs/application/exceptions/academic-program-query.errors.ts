import { AcademicProgramException } from '@modules/academic-programs/domain/exceptions';

export class AcademicProgramNotFoundException extends AcademicProgramException {
  readonly statusCode = 404;
  readonly errorKey = 'ACADEMIC_PROGRAM_NOT_FOUND';
  readonly errorCode = 'ACP_QUERY_001';

  constructor(id: string) {
    super(`No se encontró un programa académico con el id "${id}".`);
  }
}
