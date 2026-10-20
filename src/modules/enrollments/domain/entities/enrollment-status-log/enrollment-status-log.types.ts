import type { EnrollmentStatus } from '@enrollments/domain/entities';

export type EnrollmentStatusLogProps = {
  id: string;
  enrollmentId: string;
  previousStatus: EnrollmentStatus | null;
  newStatus: EnrollmentStatus;
  reason: string | null;
  changedByUserId: string;
  createdAt: Date;
};

export type CreateEnrollmentStatusLogProps = {
  id: string;
  enrollmentId: string;
  previousStatus: EnrollmentStatus | null;
  newStatus: EnrollmentStatus;
  reason: string | null;
  changedByUserId: string;
};
