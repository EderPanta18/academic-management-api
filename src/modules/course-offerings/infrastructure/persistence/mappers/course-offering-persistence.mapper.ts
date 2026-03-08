// modules/course-offerings/infrastructure/persistence/mappers/course-offering-persistence.mapper.ts

import { Prisma } from '@prisma/client';
import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import {
  CourseOffering,
  type CourseOfferingProps,
} from '@course-offerings/domain/entities';

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
    const props: CourseOfferingProps = {
      id: raw.id,
      courseId: raw.courseId,
      academicPeriodId: raw.academicPeriodId,
      professorId: raw.professorId,
      section: raw.section,
      maxStudents: raw.maxStudents,
      enrollmentDeadline: raw.enrollmentDeadline,
      status: raw.status as CourseOfferingStatus,
    };

    return CourseOffering.reconstitute(props);
  }

  static toPersistence(
    offering: CourseOffering,
  ): CourseOfferingPersistenceData {
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
