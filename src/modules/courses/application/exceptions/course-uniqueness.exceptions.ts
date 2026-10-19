import { CourseException } from '@courses/domain/exceptions';

export class CourseCodeAlreadyExistsException extends CourseException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_CODE_ALREADY_EXISTS';
  readonly errorCode = 'COUR_UNIQUENESS_001';

  constructor(academicProgramId: string, code: string) {
    super(
      `Ya existe un curso registrado con el código "${code}" en el programa académico con id "${academicProgramId}".`,
    );
  }
}
