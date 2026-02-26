// modules/students/domain/entities/student.entity.ts

import { StudentStatus } from '../constants';
import type { CreateStudentProps, StudentProps } from './student.types';

/**
 * Superset interno del constructor
 */
type InternalProps = {
  id?: number;
  careerId: number;
  code: string;
  institutionalEmail?: string | null;
  enrollmentDate: Date;
  status?: StudentStatus;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: Date | null;
};

/**
 * Entidad de dominio Student.
 *
 * Ciclo de vida:
 *   Student.create()       → id === undefined  (nueva, no persistida)
 *   Student.reconstitute() → id === number     (desde DB, ya persistida)
 */
export class Student {
  readonly id?: number; // undefined hasta que Prisma asigne el PK
  readonly careerId: number;
  readonly code: string;
  readonly institutionalEmail: string | null;
  readonly enrollmentDate: Date;
  readonly status: StudentStatus;
  readonly dni: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly birthDate: Date | null;

  private constructor(props: InternalProps) {
    this.id = props.id;
    this.careerId = props.careerId;
    this.code = props.code;
    this.institutionalEmail = props.institutionalEmail ?? null;
    this.enrollmentDate = props.enrollmentDate;
    this.status = props.status ?? StudentStatus.ACTIVE;
    this.dni = props.dni;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone ?? null;
    this.birthDate = props.birthDate ?? null;
    Object.freeze(this);
  }

  // ── Factories ─────────────────────────────────────────────────────────

  static create(props: CreateStudentProps): Student {
    return new Student(props);
  }

  static reconstitute(props: StudentProps): Student {
    return new Student(props);
  }

  // ── Computed ──────────────────────────────────────────────────────────

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  // ── Reglas de negocio ─────────────────────────────────────────────────

  /**
   * Solo ACTIVE puede inscribirse en nuevos cursos.
   * INACTIVE, GRADUATED y SUSPENDED están bloqueados.
   */
  canEnroll(): boolean {
    return this.status === StudentStatus.ACTIVE;
  }

  isActive(): boolean {
    return this.status === StudentStatus.ACTIVE;
  }

  isGraduated(): boolean {
    return this.status === StudentStatus.GRADUATED;
  }
}
