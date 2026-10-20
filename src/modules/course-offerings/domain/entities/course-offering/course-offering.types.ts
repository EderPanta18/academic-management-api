import type { CourseOfferingStatus } from './course-offering.enums';

export interface CourseOfferingProps {
  id: string;
  courseId: string;
  academicPeriodId: string;
  professorId: string | null;
  section: string;
  maxCapacity: number;
  availableCapacity: number | null;
  status: CourseOfferingStatus;
}

export interface CreateCourseOfferingProps {
  id: string;
  courseId: string;
  academicPeriodId: string;
  professorId: string | null;
  section: string;
  maxCapacity: number;
  availableCapacity: number | null;
  status: CourseOfferingStatus | null;
}
