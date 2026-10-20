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

  static toPersistence(academicPeriod: AcademicPeriod): Prisma.AcademicPeriodUncheckedCreateInput {
    return {
      id: academicPeriod.id,
      code: academicPeriod.code,
      name: academicPeriod.name,
      startDate: academicPeriod.startDate,
      endDate: academicPeriod.endDate,
      enrollmentStartDate: academicPeriod.enrollmentStartDate,
      enrollmentEndDate: academicPeriod.enrollmentEndDate,
      status: academicPeriod.status,
    };
  }
}
