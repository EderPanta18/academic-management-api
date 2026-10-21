import type { EnrollmentStatusLogReadModel } from '@enrollments/application/read-models';

export const ENROLLMENT_STATUS_LOG_QUERY_TOKEN = Symbol('ENROLLMENT_STATUS_LOG_QUERY');

export interface IEnrollmentStatusLogQuery {
  findByEnrollmentId(enrollmentId: string): Promise<EnrollmentStatusLogReadModel[]>;
}
