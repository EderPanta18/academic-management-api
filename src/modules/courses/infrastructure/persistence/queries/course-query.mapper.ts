import type { CourseReadModel } from '@courses/application/read-models';
import type { Prisma } from '@prisma/client';

export type CourseReadRaw = Prisma.CourseGetPayload<{
  include: {
    academicProgram: true;
    courseCategory: true;
  };
}>;

export class CourseQueryMapper {
  static toReadModel(raw: CourseReadRaw): CourseReadModel {
    return {
      id: raw.id,
      academicProgramId: raw.academicProgramId,
      courseCategoryId: raw.courseCategoryId,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      credits: raw.credits,
      hours: raw.hours,
      academicProgramName: raw.academicProgram.name,
      courseCategoryName: raw.courseCategory?.name ?? null,
    };
  }
}
