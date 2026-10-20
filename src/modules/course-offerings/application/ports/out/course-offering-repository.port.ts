import type { CourseOffering } from '@course-offerings/domain/entities';

export const COURSE_OFFERING_REPOSITORY_TOKEN = Symbol('COURSE_OFFERING_REPOSITORY');

export interface ICourseOfferingRepository {
  create(offering: CourseOffering): Promise<CourseOffering>;

  update(offering: CourseOffering): Promise<CourseOffering>;

  find(id: string): Promise<CourseOffering | null>;

  exists(id: string): Promise<boolean>;

  existsByCoursePeriodAndSection(
    courseId: string,
    academicPeriodId: string,
    section: string,
  ): Promise<boolean>;
}
