import type { EnrollmentStatus } from './enrollment.enums';

export type EnrollmentProps = {
  id: string;
  studentId: string;
  courseOfferingId: string;
  registeredByUserId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  statusReason: string | null;
};

export type CreateEnrollmentProps = {
  id: string;
  studentId: string;
  courseOfferingId: string;
  registeredByUserId: string;
  enrolledAt: Date;
  status: EnrollmentStatus | null;
  statusReason: string | null;
};
