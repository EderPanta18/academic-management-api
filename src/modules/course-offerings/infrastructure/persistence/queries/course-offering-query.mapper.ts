import type { CourseOfferingReadModel } from '@course-offerings/application/read-models';
import type { CourseOfferingStatus } from '@course-offerings/domain/entities';
import type { Prisma } from '@prisma/client';

export type CourseOfferingReadRaw = Prisma.CourseOfferingGetPayload<{
  include: {
    course: true;
    academicPeriod: true;
    professor: { include: { person: true } };
  };
}>;

export class CourseOfferingQueryMapper {
  static toReadModel(raw: CourseOfferingReadRaw): CourseOfferingReadModel {
    return {
      id: raw.id,
      courseId: raw.courseId,
      academicPeriodId: raw.academicPeriodId,
      professorId: raw.professorId,
      section: raw.section,
      maxCapacity: raw.maxCapacity,
      availableCapacity: raw.availableCapacity,
      status: raw.status as CourseOfferingStatus,
      courseCode: raw.course.code,
      courseName: raw.course.name,
      academicPeriodCode: raw.academicPeriod.code,
      academicPeriodName: raw.academicPeriod.name,
      professorFullName: raw.professor
        ? `${raw.professor.person.firstName} ${raw.professor.person.lastName}`.trim()
        : null,
    };
  }
}
