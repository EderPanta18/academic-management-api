import type { EnrollmentStatus } from '@enrollments/domain/entities';

export type EnrollmentStatusLogReadModel = {
  id: string;
  enrollmentId: string;
  previousStatus: EnrollmentStatus | null;
  newStatus: EnrollmentStatus;
  reason: string | null;
  changedByUserId: string;
  changedByUserEmail: string | null;
  createdAt: Date;
};
