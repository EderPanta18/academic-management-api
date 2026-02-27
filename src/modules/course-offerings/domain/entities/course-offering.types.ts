// modules/course-offerings/domain/entities/course-offering.types.ts

import { CourseOfferingStatus } from '../constants';

/**
 * Props de una CourseOffering ya persistida (viene de la DB).
 */
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

/**
 * Props de entrada para CREAR una nueva CourseOffering.
 */
export interface CreateCourseOfferingProps {
  courseId: number;
  academicPeriodId: number;
  professorId?: number;
  section?: string; // Default 'A'
  maxStudents?: number; // Default 30
  enrollmentDeadline?: Date;
  status?: CourseOfferingStatus; // Default INACTIVE
}
