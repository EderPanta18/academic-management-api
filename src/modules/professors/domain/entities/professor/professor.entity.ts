// modules/professors/domain/entities/professor/professor.entity.ts

import { ProfessorStatus } from "@professors/domain/constants";
import type { CreateProfessorProps, ProfessorProps } from "./professor.types";

type ProfessorInternalProps = {
  id?: number;
  code: string;
  departmentId?: number | null;
  specialty?: string | null;
  institutionalEmail?: string | null;
  hireDate?: Date | null;
  status?: ProfessorStatus | null;
};

export class Professor {
  readonly id?: number;
  readonly code: string;
  readonly departmentId: number | null;
  readonly specialty: string | null;
  readonly institutionalEmail: string | null;
  readonly hireDate: Date | null;
  readonly status: ProfessorStatus;

  private constructor(props: ProfessorInternalProps) {
    this.id = props.id;
    this.departmentId = props.departmentId ?? null;
    this.code = props.code;
    this.specialty = props.specialty ?? null;
    this.institutionalEmail = props.institutionalEmail ?? null;
    this.hireDate = props.hireDate ?? null;
    this.status = props.status ?? ProfessorStatus.ACTIVE;

    Object.freeze(this);
  }

  static create(props: CreateProfessorProps): Professor {
    return new Professor(props);
  }

  static reconstitute(props: ProfessorProps): Professor {
    return new Professor(props);
  }

  canBeAssignedToCourse(): boolean {
    return this.status === ProfessorStatus.ACTIVE;
  }

  isActive(): boolean {
    return this.status === ProfessorStatus.ACTIVE;
  }
}
