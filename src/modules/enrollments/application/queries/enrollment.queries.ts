import type { EnrollmentStatus } from '@enrollments/domain/entities';

export type ListEnrollmentsQuery = {
  studentId?: string;
  courseOfferingId?: string;
  academicPeriodId?: string;
  statuses?: EnrollmentStatus[];
  search?: string;
};
