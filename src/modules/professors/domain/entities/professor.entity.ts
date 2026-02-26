// modules/professors/domain/entities/professor.entity.ts

import { ProfessorStatus } from '../constants';
import type { CreateProfessorProps, ProfessorProps } from './professor.types';

/**
 * Superset interno del constructor.
 */
type InternalProps = {
  id?: number;
  departmentId?: number | null;
  code: string;
  specialty?: string | null;
  institutionalEmail?: string | null;
  hireDate?: Date | null;
  status?: ProfessorStatus;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: Date | null;
};

/**
 * Entidad de dominio Professor.
 *
 * Ciclo de vida:
 *   Professor.create()       → id === undefined  (nueva, no persistida)
 *   Professor.reconstitute() → id === number     (desde DB, ya persistida)
 */
export class Professor {
  readonly id?: number;
  readonly departmentId: number | null;
  readonly specialty: string | null;
  readonly code: string;
  readonly institutionalEmail: string | null;
  readonly hireDate: Date | null;
  readonly status: ProfessorStatus;
  readonly dni: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly birthDate: Date | null;

  private constructor(props: InternalProps) {
    this.id = props.id;
    this.departmentId = props.departmentId ?? null;
    this.specialty = props.specialty ?? null;
    this.code = props.code;
    this.institutionalEmail = props.institutionalEmail ?? null;
    this.hireDate = props.hireDate ?? null;
    this.status = props.status ?? ProfessorStatus.ACTIVE;
    this.dni = props.dni;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone ?? null;
    this.birthDate = props.birthDate ?? null;
    Object.freeze(this);
  }

  // ── Factories ─────────────────────────────────────────────────────────────

  static create(props: CreateProfessorProps): Professor {
    return new Professor(props);
  }

  static reconstitute(props: ProfessorProps): Professor {
    return new Professor(props);
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  // ── Reglas de negocio ─────────────────────────────────────────────────────

  isActive(): boolean {
    return this.status === ProfessorStatus.ACTIVE;
  }

  /**
   * Sólo ACTIVE puede recibir nuevas asignaciones de curso.
   * ON_LEAVE e INACTIVE están bloqueados.
   */
  canBeAssignedToCourse(): boolean {
    return this.status === ProfessorStatus.ACTIVE;
  }
}
