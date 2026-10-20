import { CourseOfferingException } from '@course-offerings/domain/exceptions';

export class CourseOfferingSectionAlreadyExistsException extends CourseOfferingException {
  readonly statusCode = 409;
  readonly errorKey = 'COURSE_OFFERING_SECTION_ALREADY_EXISTS';
  readonly errorCode = 'COF_UNIQUENESS_001';

  constructor(courseId: string, academicPeriodId: string, section: string) {
    super(
      `Ya existe una oferta para el curso "${courseId}" en el periodo académico "${academicPeriodId}" con la sección "${section}".`,
    );
  }
}
