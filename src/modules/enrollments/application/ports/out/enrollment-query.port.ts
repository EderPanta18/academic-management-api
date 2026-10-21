import type { PaginationVO } from '@core/pagination';
import type { EnrollmentReadModel } from '@enrollments/application/read-models';
import type { EnrollmentStatus } from '@enrollments/domain/entities';

export const ENROLLMENT_QUERY_TOKEN = Symbol('ENROLLMENT_QUERY');

export type EnrollmentQueryFilters = {
  studentId?: string;
  courseOfferingId?: string;
  academicPeriodId?: string;
  statuses?: EnrollmentStatus[];
  search?: string;
};

export interface IEnrollmentQuery {
  find(id: string): Promise<EnrollmentReadModel | null>;

  findAll(
    pagination: PaginationVO,
    filters?: EnrollmentQueryFilters,
  ): Promise<[EnrollmentReadModel[], number]>;
}
