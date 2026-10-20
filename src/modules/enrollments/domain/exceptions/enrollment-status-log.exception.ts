import { EnrollmentException } from './enrollment.exception';

export abstract class EnrollmentStatusLogException extends EnrollmentException {
  override readonly entity = 'enrollment_status_log';
}
