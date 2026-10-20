import type { CourseOffering } from '@course-offerings/domain/entities';

export const COURSE_OFFERING_REPOSITORY_TOKEN = Symbol('COURSE_OFFERING_REPOSITORY');

export interface ICourseOfferingRepository {
  create(offering: CourseOffering): Promise<CourseOffering>;

  find(id: string): Promise<CourseOffering | null>;

  update(offering: CourseOffering): Promise<CourseOffering>;

  exists(id: string): Promise<boolean>;

  existsByCoursePeriodAndSection(
    courseId: string,
    academicPeriodId: string,
    section: string,
  ): Promise<boolean>;
}
