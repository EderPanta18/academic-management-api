// modules/courses/infrastructure/persistence/mappers/course-persistence.mapper.ts

import { Course } from '@courses/domain/entities';
import type { Prisma } from '@prisma/client';

type CourseRaw = Prisma.CourseGetPayload<Record<string, never>>;

interface CoursePersistenceData {
  careerId: number;
  categoryId: number | null;
  name: string;
  description: string | null;
  credits: number;
}

export class CoursePersistenceMapper {
  static toDomain(raw: CourseRaw): Course {
    return Course.reconstitute({
      id: raw.id,
      careerId: raw.careerId,
      categoryId: raw.categoryId,
      name: raw.name,
      description: raw.description,
      credits: raw.credits,
    });
  }

  static toPersistence(course: Course): CoursePersistenceData {
    return {
      careerId: course.careerId,
      categoryId: course.categoryId,
      name: course.name,
      description: course.description,
      credits: course.credits,
    };
  }
}
