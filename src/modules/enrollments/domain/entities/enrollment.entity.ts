// modules/enrollments/domain/entities/enrollment.entity.ts

import { EnrollmentStatus } from '../constants';
import type {
  EnrollmentProps,
  CreateEnrollmentProps,
} from './enrollment.types';

/** Superset interno del constructor. */
type InternalProps = {
  id?: number;
  studentId: number;
  courseOfferingId: number;
  status?: EnrollmentStatus;
  enrollmentDate: Date;
  createdBy?: number | null;
};

/**
 * Entidad de dominio Enrollment.
 * Representa la matrícula de un alumno en una oferta de curso concreta.
 */
export class Enrollment {
  readonly id?: number;
  readonly studentId: number;
  readonly courseOfferingId: number;
  readonly status: EnrollmentStatus;
  readonly enrollmentDate: Date;
  readonly createdBy: number | null;

  private constructor(props: InternalProps) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.courseOfferingId = props.courseOfferingId;
    this.status = props.status ?? EnrollmentStatus.ENROLLED;
    this.enrollmentDate = props.enrollmentDate;
    this.createdBy = props.createdBy ?? null;
    Object.freeze(this);
  }

  // ── Factories ────────────────────────────────────────────────────────────

  static create(props: CreateEnrollmentProps): Enrollment {
    return new Enrollment(props);
  }

  static reconstitute(props: EnrollmentProps): Enrollment {
    return new Enrollment(props);
  }

  // ── Reglas de negocio ─────────────────────────────────────────────────────

  /** Solo ENROLLED puede retirarse formalmente. */
  get canWithdraw(): boolean {
    return this.status === EnrollmentStatus.ENROLLED;
  }

  /** Solo ENROLLED puede cerrarse como completado. */
  get canComplete(): boolean {
    return this.status === EnrollmentStatus.ENROLLED;
  }

  /** Solo ENROLLED puede recibir una suspensión. */
  get canSuspend(): boolean {
    return this.status === EnrollmentStatus.ENROLLED;
  }

  /**
   * Solo SUSPENDED puede ser reactivado.
   * WITHDRAWN y COMPLETED son estados terminales — no se revierten.
   */
  get canReactivate(): boolean {
    return this.status === EnrollmentStatus.SUSPENDED;
  }

  /** Participa activamente: puede recibir notas y asistencia. */
  get isEnrolled(): boolean {
    return this.status === EnrollmentStatus.ENROLLED;
  }

  get isWithdrawn(): boolean {
    return this.status === EnrollmentStatus.WITHDRAWN;
  }

  get isCompleted(): boolean {
    return this.status === EnrollmentStatus.COMPLETED;
  }

  get isSuspended(): boolean {
    return this.status === EnrollmentStatus.SUSPENDED;
  }

  /** Estado terminal: no puede recibir ninguna operación de cambio. */
  get isTerminal(): boolean {
    return (
      this.status === EnrollmentStatus.WITHDRAWN ||
      this.status === EnrollmentStatus.COMPLETED
    );
  }
}
