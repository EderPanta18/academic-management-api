import type { CourseOfferingStatus } from './course-offering.enums';

export type CourseOfferingProps = {
  id: string;
  courseId: string;
  academicPeriodId: string;
  professorId: string | null;
  section: string;
  maxCapacity: number;
  availableCapacity: number | null;
  status: CourseOfferingStatus;
};

export type CreateCourseOfferingProps = {
  id: string;
  courseId: string;
  academicPeriodId: string;
  professorId: string | null;
  section: string;
  maxCapacity: number;
  availableCapacity: number | null;
};
