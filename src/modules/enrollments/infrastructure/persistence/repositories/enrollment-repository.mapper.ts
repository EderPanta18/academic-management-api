import { Enrollment, type EnrollmentStatus } from '@enrollments/domain/entities';
import type { EnrollmentStatusLog } from '@enrollments/domain/records';
import type { Prisma } from '@prisma/client';

type EnrollmentRaw = Prisma.EnrollmentGetPayload<Record<string, never>>;

export class EnrollmentRepositoryMapper {
  static toDomain(raw: EnrollmentRaw): Enrollment {
    return Enrollment.reconstitute({
      id: raw.id,
      studentId: raw.studentId,
      courseOfferingId: raw.courseOfferingId,
      registeredByUserId: raw.registeredByUserId,
      status: raw.status as EnrollmentStatus,
      enrolledAt: raw.enrolledAt,
      statusReason: raw.statusReason,
    });
  }

  static toCreatePersistence(enrollment: Enrollment): Prisma.EnrollmentUncheckedCreateInput {
    return {
      id: enrollment.id,
      studentId: enrollment.studentId,
      courseOfferingId: enrollment.courseOfferingId,
      registeredByUserId: enrollment.registeredByUserId,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      statusReason: enrollment.statusReason,
    };
  }

  static toUpdatePersistence(enrollment: Enrollment): Prisma.EnrollmentUncheckedUpdateInput {
    return {
      status: enrollment.status,
      statusReason: enrollment.statusReason,
    };
  }

  static logToPersistence(
    log: EnrollmentStatusLog,
  ): Prisma.EnrollmentStatusLogUncheckedCreateInput {
    return {
      id: log.id,
      enrollmentId: log.enrollmentId,
      previousStatus: log.previousStatus,
      newStatus: log.newStatus,
      reason: log.reason,
      changedByUserId: log.changedByUserId,
      createdAt: log.createdAt,
    };
  }
}
