import type { EnrollmentStatus } from '@enrollments/domain/entities';
import type { EnrollmentStatusLog } from './enrollment-status-log.types';

export type CreateEnrollmentStatusLogInput = {
  id: string;
  enrollmentId: string;
  previousStatus: EnrollmentStatus | null;
  newStatus: EnrollmentStatus;
  reason: string | null;
  changedByUserId: string;
};

export function createEnrollmentStatusLog(
  input: CreateEnrollmentStatusLogInput,
): EnrollmentStatusLog {
  return Object.freeze({
    id: input.id,
    enrollmentId: input.enrollmentId,
    previousStatus: input.previousStatus,
    newStatus: input.newStatus,
    reason: input.reason,
    changedByUserId: input.changedByUserId,
    createdAt: new Date(),
  });
}
