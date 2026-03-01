// modules/enrollments/domain/entities/enrollment.types.ts

import { EnrollmentStatus } from '../constants';

/** Props de un Enrollment ya persistido */
export interface EnrollmentProps {
  id: number;
  studentId: number;
  courseOfferingId: number;
  status: EnrollmentStatus;
  enrollmentDate: Date;
  createdBy: number | null;
}

/** Props de entrada para CREAR un nuevo Enrollment. */
export interface CreateEnrollmentProps {
  studentId: number;
  courseOfferingId: number;
  enrollmentDate: Date;
  createdBy?: number;
}

/**
 * Tipo inmutable del log de cambios de estado.
 * No es una entidad: no tiene ciclo de vida propio, no transiciona, no tiene
 * updatedat ni deletedat. Solo nace cuando enrollment.status cambia.
 * El repositorio lo inserta automáticamente en la misma $transaction.
 */
export interface EnrollmentStatusLogProps {
  id: number;
  enrollmentId: number;
  previousStatus: EnrollmentStatus;
  newStatus: EnrollmentStatus;
  reason: string | null;
  changedBy: number | null;
  createdAt: Date;
}
