import type { PaginationVO } from '@core/pagination';
import type { CourseOfferingReadModel } from '@course-offerings/application/read-models';
import type { CourseOfferingStatus } from '@course-offerings/domain/entities';

export const COURSE_OFFERING_QUERY_TOKEN = Symbol('COURSE_OFFERING_QUERY');

export type CourseOfferingQueryFilters = {
  courseId?: string;
  academicPeriodId?: string;
  professorId?: string;
  statuses?: CourseOfferingStatus[];
  search?: string;
};

export interface ICourseOfferingQuery {
  find(id: string): Promise<CourseOfferingReadModel | null>;

  findAll(
    pagination: PaginationVO,
    filters?: CourseOfferingQueryFilters,
  ): Promise<[CourseOfferingReadModel[], number]>;
}
