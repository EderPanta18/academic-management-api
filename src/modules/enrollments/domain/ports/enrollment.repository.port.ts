// modules/enrollments/domain/ports/enrollment.repository.port.ts

import { PaginationVO } from '@shared/domain/value-objects';
import { EnrollmentStatus } from '../constants';
import { Enrollment, type EnrollmentStatusLogProps } from '../entities';

// ── Tipos de entrada del repositorio ─────────────────────────────────────────

export interface ChangeEnrollmentStatusProps {
  enrollmentId: number;
  previousStatus: EnrollmentStatus;
  newStatus: EnrollmentStatus;
  reason: string | null;
  changedBy: number | null;
}

export interface FindAllEnrollmentsFilters {
  studentId?: number;
  courseOfferingId?: number;
  statuses?: EnrollmentStatus[];
}

// ── Puerto del repositorio ────────────────────────────────────────────────────

export interface IEnrollmentRepository {
  /**
   * Persiste una inscripción nueva.
   * Solo INSERT — una inscripción no se edita, solo cambia de estado.
   */
  save(enrollment: Enrollment): Promise<Enrollment>;

  /** Busca una inscripción activa (no soft-deleted) por su id. */
  findById(id: number): Promise<Enrollment | null>;

  /**
   * Lista inscripciones con paginación y filtros opcionales.
   */
  findAll(
    pagination: PaginationVO,
    filters?: FindAllEnrollmentsFilters,
  ): Promise<[Enrollment[], number]>;

  /**
   * Transición atómica de estado + inserción del EnrollmentStatusLog.
   */
  changeStatus(props: ChangeEnrollmentStatusProps): Promise<Enrollment>;

  /**
   * Retorna el historial completo de cambios de estado de una inscripción.
   */
  findStatusLogByEnrollmentId(
    enrollmentId: number,
  ): Promise<EnrollmentStatusLogProps[]>;

  /**
   * Verifica si ya existe una inscripción (no soft-deleted) para
   * la combinación alumno + oferta.
   */
  existsByStudentAndOffering(
    studentId: number,
    courseOfferingId: number,
  ): Promise<boolean>;

  /**
   * Verifica si la oferta ya alcanzó su maxStudents
   * contando inscripciones activas en estado ENROLLED.
   */
  isAtCapacity(courseOfferingId: number): Promise<boolean>;

  /** Soft-delete de la inscripción. Uso administrativo excepcional. */
  delete(id: number): Promise<void>;
}
