// modules/course-offerings/domain/entities/course-offering/course-offering.types.ts

import type { CourseOfferingStatus } from '@course-offerings/domain/constants';

export interface CourseOfferingProps {
  id: number;
  courseId: number;
  academicPeriodId: number;
  professorId: number | null;
  section: string;
  maxStudents: number;
  enrollmentDeadline: Date | null;
  status: CourseOfferingStatus;
}

export interface CreateCourseOfferingProps {
  courseId: number;
  academicPeriodId: number;
  professorId?: number | null;
  section?: string | null;
  maxStudents?: number | null;
  enrollmentDeadline?: Date | null;
  status?: CourseOfferingStatus | null;
}
