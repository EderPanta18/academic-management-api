import type { PaginationVO } from '@core/pagination';
import type { CourseReadModel } from '@courses/application/read-models';

export const COURSE_QUERY_TOKEN = Symbol('COURSE_QUERY');

export type CourseQueryFilters = {
  academicProgramId?: string;
  courseCategoryId?: string;
  search?: string;
};

export interface ICourseQuery {
  find(id: string): Promise<CourseReadModel | null>;

  findAll(
    pagination: PaginationVO,
    filters?: CourseQueryFilters,
  ): Promise<[CourseReadModel[], number]>;
}
