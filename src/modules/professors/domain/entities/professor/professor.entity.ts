import { ProfessorStatus } from './professor.enums';
import type { CreateProfessorProps, ProfessorProps } from './professor.types';

export class Professor {
  readonly id: string;
  readonly personId: string;
  readonly code: string;
  readonly institutionalEmail: string | null;
  readonly department: string | null;
  readonly specialty: string | null;
  readonly status: ProfessorStatus;

  private constructor(props: ProfessorProps) {
    this.id = props.id;
    this.personId = props.personId;
    this.code = props.code;
    this.institutionalEmail = props.institutionalEmail;
    this.department = props.department;
    this.specialty = props.specialty;
    this.status = props.status;

    Object.freeze(this);
  }

  static reconstitute(props: ProfessorProps): Professor {
    return new Professor(props);
  }

  static create(props: CreateProfessorProps): Professor {
    return new Professor({
      ...props,
      status: props.status ?? ProfessorStatus.ACTIVE,
    });
  }

  canBeAssignedToCourse(): boolean {
    return this.status === ProfessorStatus.ACTIVE;
  }

  isActive(): boolean {
    return this.status === ProfessorStatus.ACTIVE;
  }

  isInactive(): boolean {
    return this.status === ProfessorStatus.INACTIVE;
  }

  isOnLeave(): boolean {
    return this.status === ProfessorStatus.ON_LEAVE;
  }
}
