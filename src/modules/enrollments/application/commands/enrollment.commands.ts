import type { EnrollmentStatus } from '@enrollments/domain/entities';

export type EnrollStudentCommand = {
  studentId: string;
  courseOfferingId: string;
  registeredByUserId: string;
  enrolledAt: Date;
  status: EnrollmentStatus | null;
  statusReason: string | null;
};

export type ConfirmEnrollmentCommand = {
  enrollmentId: string;
  changedByUserId: string;
};

export type CancelEnrollmentCommand = {
  enrollmentId: string;
  changedByUserId: string;
  reason: string | null;
};

export type WithdrawEnrollmentCommand = {
  enrollmentId: string;
  changedByUserId: string;
  reason: string | null;
};

export type RejectEnrollmentCommand = {
  enrollmentId: string;
  changedByUserId: string;
  reason: string | null;
};

export type FinishEnrollmentCommand = {
  enrollmentId: string;
  changedByUserId: string;
  reason: string | null;
};
