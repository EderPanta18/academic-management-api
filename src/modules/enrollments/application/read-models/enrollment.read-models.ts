import type { EnrollmentStatus } from '@enrollments/domain/entities';

export type EnrollmentReadModel = {
  id: string;
  studentId: string;
  courseOfferingId: string;
  registeredByUserId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  statusReason: string | null;

  // Datos del estudiante
  studentCode: string;
  studentFirstName: string;
  studentLastName: string;

  // Datos del curso
  courseId: string;
  courseCode: string;
  courseName: string;

  // Datos de la oferta
  section: string;

  // Datos del período académico
  academicPeriodId: string;
  academicPeriodCode: string;
  academicPeriodName: string;

  // Datos del usuario que registró
  registeredByUserEmail: string | null;
};
