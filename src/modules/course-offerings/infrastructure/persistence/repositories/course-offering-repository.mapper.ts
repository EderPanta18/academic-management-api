import { CourseOffering, type CourseOfferingStatus } from '@course-offerings/domain/entities';
import type { Prisma } from '@prisma/client';

type CourseOfferingRaw = Prisma.CourseOfferingGetPayload<Record<string, never>>;

export class CourseOfferingRepositoryMapper {
  static toDomain(raw: CourseOfferingRaw): CourseOffering {
    return CourseOffering.reconstitute({
      id: raw.id,
      courseId: raw.courseId,
      academicPeriodId: raw.academicPeriodId,
      professorId: raw.professorId,
      section: raw.section,
      maxCapacity: raw.maxCapacity,
      availableCapacity: raw.availableCapacity,
      status: raw.status as CourseOfferingStatus,
    });
  }

  static toPersistence(offering: CourseOffering): Prisma.CourseOfferingUncheckedCreateInput {
    return {
      id: offering.id,
      courseId: offering.courseId,
      academicPeriodId: offering.academicPeriodId,
      professorId: offering.professorId,
      section: offering.section,
      maxCapacity: offering.maxCapacity,
      availableCapacity: offering.availableCapacity,
      status: offering.status,
    };
  }
}
