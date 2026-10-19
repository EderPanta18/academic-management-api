import { Course } from '@courses/domain/entities';
import type { Prisma } from '@prisma/client';

type CourseRaw = Prisma.CourseGetPayload<Record<string, never>>;

export class CourseRepositoryMapper {
  static toDomain(raw: CourseRaw): Course {
    return Course.reconstitute({
      id: raw.id,
      academicProgramId: raw.academicProgramId,
      courseCategoryId: raw.courseCategoryId,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      credits: raw.credits,
      hours: raw.hours,
    });
  }

  static toPersistence(course: Course): Prisma.CourseUncheckedCreateInput {
    return {
      id: course.id,
      academicProgramId: course.academicProgramId,
      courseCategoryId: course.courseCategoryId,
      code: course.code,
      name: course.name,
      description: course.description,
      credits: course.credits,
      hours: course.hours,
    };
  }
}
