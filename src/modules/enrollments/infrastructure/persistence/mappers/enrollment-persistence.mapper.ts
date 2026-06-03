// modules/enrollments/infrastructure/persistence/mappers/enrollment-persistence.mapper.ts

import type { EnrollmentStatus } from '@enrollments/domain/constants';
import { Enrollment, type EnrollmentStatusLogProps } from '@enrollments/domain/entities';
import type { Prisma } from '@prisma/client';

type EnrollmentRaw = Prisma.EnrollmentGetPayload<Record<string, never>>;
type EnrollmentStatusLogRaw = Prisma.EnrollmentStatusLogGetPayload<Record<string, never>>;

interface EnrollmentPersistenceData {
  studentId: number;
  courseOfferingId: number;
  status: EnrollmentStatus;
  enrollmentDate: Date;
  createdBy: number | null;
}

export class EnrollmentPersistenceMapper {
  static toDomain(raw: EnrollmentRaw): Enrollment {
    return Enrollment.reconstitute({
      id: raw.id,
      studentId: raw.studentId,
      courseOfferingId: raw.courseOfferingId,
      status: raw.status as EnrollmentStatus,
      enrollmentDate: raw.enrollmentDate,
      createdBy: raw.createdBy,
    });
  }

  static toPersistence(enrollment: Enrollment): EnrollmentPersistenceData {
    return {
      studentId: enrollment.studentId,
      courseOfferingId: enrollment.courseOfferingId,
      status: enrollment.status,
      enrollmentDate: enrollment.enrollmentDate,
      createdBy: enrollment.createdBy,
    };
  }

  static statusLogToDomain(raw: EnrollmentStatusLogRaw): EnrollmentStatusLogProps {
    return {
      id: raw.id,
      enrollmentId: raw.enrollmentId,
      previousStatus: raw.previousStatus as EnrollmentStatus,
      newStatus: raw.newStatus as EnrollmentStatus,
      reason: raw.reason,
      changedBy: raw.changedBy,
      createdAt: raw.createdAt,
    };
  }
}
