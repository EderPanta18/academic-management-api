// modules/course-offerings/infrastructure/persistence/mappers/course-offering-persistence.mapper.ts

import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import { CourseOffering } from '@course-offerings/domain/entities';
import { Prisma } from '@prisma/client';

type CourseOfferingRaw = Prisma.CourseOfferingGetPayload<Record<string, never>>;

interface CourseOfferingPersistenceData {
  courseId: number;
  academicPeriodId: number;
  professorId: number | null;
  section: string;
  maxStudents: number;
  enrollmentDeadline: Date | null;
  status: CourseOfferingStatus;
}

export class CourseOfferingPersistenceMapper {
  static toDomain(raw: CourseOfferingRaw): CourseOffering {
    return CourseOffering.reconstitute({
      id: raw.id,
      courseId: raw.courseId,
      academicPeriodId: raw.academicPeriodId,
      professorId: raw.professorId,
      section: raw.section,
      maxStudents: raw.maxStudents,
      enrollmentDeadline: raw.enrollmentDeadline,
      status: raw.status as CourseOfferingStatus,
    });
  }

  static toPersistence(offering: CourseOffering): CourseOfferingPersistenceData {
    return {
      courseId: offering.courseId,
      academicPeriodId: offering.academicPeriodId,
      professorId: offering.professorId,
      section: offering.section,
      maxStudents: offering.maxStudents,
      enrollmentDeadline: offering.enrollmentDeadline,
      status: offering.status,
    };
  }
}
