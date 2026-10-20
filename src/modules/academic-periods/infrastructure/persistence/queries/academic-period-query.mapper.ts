import type { AcademicPeriodReadModel } from '@academic-periods/application/read-models';
import type { AcademicPeriodStatus } from '@academic-periods/domain/entities';
import type { Prisma } from '@prisma/client';

export type AcademicPeriodReadRaw = Prisma.AcademicPeriodGetPayload<Record<string, never>>;

export class AcademicPeriodQueryMapper {
  static toReadModel(raw: AcademicPeriodReadRaw): AcademicPeriodReadModel {
    return {
      id: raw.id,
      code: raw.code,
      name: raw.name,
      startDate: raw.startDate,
      endDate: raw.endDate,
      enrollmentStartDate: raw.enrollmentStartDate,
      enrollmentEndDate: raw.enrollmentEndDate,
      status: raw.status as AcademicPeriodStatus,
    };
  }
}
