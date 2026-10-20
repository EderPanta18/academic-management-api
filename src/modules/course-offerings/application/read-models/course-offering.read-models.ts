import type { CourseOfferingStatus } from '@course-offerings/domain/entities';

export type CourseOfferingReadModel = {
  id: string;
  courseId: string;
  academicPeriodId: string;
  professorId: string | null;
  section: string;
  maxCapacity: number;
  availableCapacity: number | null;
  status: CourseOfferingStatus;

  // Datos de relaciones
  courseCode: string;
  courseName: string;
  academicPeriodCode: string;
  academicPeriodName: string;
  professorFullName: string | null;
};
