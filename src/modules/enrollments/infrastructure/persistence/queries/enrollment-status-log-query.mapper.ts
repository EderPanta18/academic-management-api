import type { EnrollmentStatusLogReadModel } from '@enrollments/application/read-models';
import type { EnrollmentStatus } from '@enrollments/domain/entities';
import type { Prisma } from '@prisma/client';

export type EnrollmentStatusLogReadRaw = Prisma.EnrollmentStatusLogGetPayload<{
  include: { changedByUser: true };
}>;

export class EnrollmentStatusLogQueryMapper {
  static toReadModel(raw: EnrollmentStatusLogReadRaw): EnrollmentStatusLogReadModel {
    return {
      id: raw.id,
      enrollmentId: raw.enrollmentId,
      previousStatus: raw.previousStatus as EnrollmentStatus | null,
      newStatus: raw.newStatus as EnrollmentStatus,
      reason: raw.reason,
      changedByUserId: raw.changedByUserId,
      changedByUserEmail: raw.changedByUser.email,
      createdAt: raw.createdAt,
    };
  }
}
