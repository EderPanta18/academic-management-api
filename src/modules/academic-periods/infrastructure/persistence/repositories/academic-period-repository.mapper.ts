import { AcademicPeriod, type AcademicPeriodStatus } from '@academic-periods/domain/entities';
import type { Prisma } from '@prisma/client';

type AcademicPeriodRaw = Prisma.AcademicPeriodGetPayload<Record<string, never>>;

export class AcademicPeriodRepositoryMapper {
  static toDomain(raw: AcademicPeriodRaw): AcademicPeriod {
    return AcademicPeriod.reconstitute({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      startDate: raw.startDate,
      endDate: raw.endDate,
      enrollmentStartDate: raw.enrollmentStartDate,
      enrollmentEndDate: raw.enrollmentEndDate,
      status: raw.status as AcademicPeriodStatus,
    });
  }

  static toPersistence(period: AcademicPeriod): Prisma.AcademicPeriodUncheckedCreateInput {
    return {
      id: period.id,
      code: period.code,
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate,
      enrollmentStartDate: period.enrollmentStartDate,
      enrollmentEndDate: period.enrollmentEndDate,
      status: period.status,
    };
  }
}
