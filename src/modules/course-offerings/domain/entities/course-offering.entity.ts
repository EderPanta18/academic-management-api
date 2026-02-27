// modules/course-offerings/domain/entities/course-offering.entity.ts

import { CourseOfferingStatus } from '../constants';
import type {
  CourseOfferingProps,
  CreateCourseOfferingProps,
} from './course-offering.types';

/**
 * Superset interno del constructor.
 */
type InternalProps = {
  id?: number;
  courseId: number;
  academicPeriodId: number;
  professorId?: number | null;
  section?: string;
  maxStudents?: number;
  enrollmentDeadline?: Date | null;
  status?: CourseOfferingStatus;
};

/**
 * Entidad de dominio CourseOffering.
 *
 * Representa la instancia semestral de un curso:
 * qué curso, en qué período, con qué profesor, en qué sección y con cuántos cupos.
 *
 * Ciclo de vida:
 *   CourseOffering.create()       → id undefined (nueva, no persistida)
 *   CourseOffering.reconstitute() → id number    (desde DB, ya persistida)
 */
export class CourseOffering {
  readonly id?: number;
  readonly courseId: number;
  readonly academicPeriodId: number;
  readonly professorId: number | null;
  readonly section: string;
  readonly maxStudents: number;
  readonly enrollmentDeadline: Date | null;
  readonly status: CourseOfferingStatus;

  private constructor(props: InternalProps) {
    this.id = props.id;
    this.courseId = props.courseId;
    this.academicPeriodId = props.academicPeriodId;
    this.professorId = props.professorId ?? null;
    this.section = props.section ?? 'A';
    this.maxStudents = props.maxStudents ?? 30;
    this.enrollmentDeadline = props.enrollmentDeadline ?? null;
    this.status = props.status ?? CourseOfferingStatus.INACTIVE;
    Object.freeze(this);
  }

  // ─── Factories ───────────────────────────────────────────────────────────

  static create(props: CreateCourseOfferingProps): CourseOffering {
    return new CourseOffering(props);
  }

  static reconstitute(props: CourseOfferingProps): CourseOffering {
    return new CourseOffering(props);
  }

  // ─── Reglas de negocio ───────────────────────────────────────────────────

  /**
   * Solo una oferta ACTIVE puede recibir un profesor asignado.
   * CANCELLED y COMPLETED están cerradas; INACTIVE aún no está disponible.
   */
  get canAssignProfessor(): boolean {
    return (
      this.status === CourseOfferingStatus.ACTIVE ||
      this.status === CourseOfferingStatus.INACTIVE
    );
  }

  /**
   * Solo una oferta ACTIVE acepta nuevas inscripciones.
   * Si enrollmentDeadline existe, también debe no haber vencido.
   */
  get isOpenForEnrollment(): boolean {
    if (this.status !== CourseOfferingStatus.ACTIVE) return false;
    if (!this.enrollmentDeadline) return true;
    return new Date() <= this.enrollmentDeadline;
  }

  get isActive(): boolean {
    return this.status === CourseOfferingStatus.ACTIVE;
  }

  get isCancelled(): boolean {
    return this.status === CourseOfferingStatus.CANCELLED;
  }

  get isCompleted(): boolean {
    return this.status === CourseOfferingStatus.COMPLETED;
  }

  get hasProfessor(): boolean {
    return this.professorId !== null;
  }
}
