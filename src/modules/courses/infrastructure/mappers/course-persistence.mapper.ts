// modules/courses/infrastructure/mappers/course-persistence.mapper.ts

import { Prisma } from '@prisma/client';
import { Course, type CourseProps } from '@courses/domain/entities';

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
    const props: CourseProps = {
      id: raw.id,
      careerId: raw.careerId,
      categoryId: raw.categoryId,
      name: raw.name,
      description: raw.description,
      credits: raw.credits,
    };
    return Course.reconstitute(props);
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
