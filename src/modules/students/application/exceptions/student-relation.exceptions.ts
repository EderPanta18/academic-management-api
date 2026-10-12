import { StudentException } from '@students/domain/exceptions';

export class StudentAcademicProgramNotFoundException extends StudentException {
  readonly statusCode = 404;
  readonly errorKey = 'STUDENT_ACADEMIC_PROGRAM_NOT_FOUND';
  readonly errorCode = 'STU_RELATION_001';

  constructor(academicProgramId: string) {
    super(`No se encontró el programa académico con el id "${academicProgramId}".`);
  }
}
