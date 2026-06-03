// modules/enrollments/domain/entities/enrollment.types.ts

import type { EnrollmentStatus } from '@enrollments/domain/constants';

export interface EnrollmentProps {
  id: number;
  studentId: number;
  courseOfferingId: number;
  status: EnrollmentStatus;
  enrollmentDate: Date;
  createdBy: number | null;
}

export interface CreateEnrollmentProps {
  studentId: number;
  courseOfferingId: number;
  enrollmentDate: Date;
  createdBy?: number | null;
}

export interface EnrollmentStatusLogProps {
  id: number;
  enrollmentId: number;
  previousStatus: EnrollmentStatus;
  newStatus: EnrollmentStatus;
  reason: string | null;
  changedBy: number | null;
  createdAt: Date;
}
