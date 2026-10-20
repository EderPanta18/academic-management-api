import type { EnrollmentStatus } from '@enrollments/domain/entities';

export type EnrollmentStatusLog = {
  readonly id: string;
  readonly enrollmentId: string;
  readonly previousStatus: EnrollmentStatus | null;
  readonly newStatus: EnrollmentStatus;
  readonly reason: string | null;
  readonly changedByUserId: string;
  readonly createdAt: Date;
};
