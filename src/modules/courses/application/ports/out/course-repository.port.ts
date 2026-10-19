import type { Course } from '@courses/domain/entities';

export const COURSE_REPOSITORY_TOKEN = Symbol('COURSE_REPOSITORY');

export interface ICourseRepository {
  create(course: Course): Promise<Course>;

  find(id: string): Promise<Course | null>;

  exists(id: string): Promise<boolean>;

  existsByProgramAndCode(academicProgramId: string, code: string): Promise<boolean>;
}
