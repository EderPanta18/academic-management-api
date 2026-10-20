import type { CourseOfferingStatus } from '@course-offerings/domain/entities';

export type ListCourseOfferingsQuery = {
  courseId?: string;
  academicPeriodId?: string;
  professorId?: string;
  statuses?: CourseOfferingStatus[];
  search?: string;
};
