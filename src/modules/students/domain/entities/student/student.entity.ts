import { StudentStatus } from '@students/domain/enums';
import type { CreateStudentProps, StudentProps } from './student.types';

export class Student {
  readonly id: string;
  readonly personId: string;
  readonly academicProgramId: string;
  readonly code: string;
  readonly institutionalEmail: string | null;
  readonly admissionPeriod: string | null;
  readonly status: StudentStatus;

  private constructor(props: StudentProps) {
    this.id = props.id;
    this.personId = props.personId;
    this.academicProgramId = props.academicProgramId;
    this.code = props.code;
    this.institutionalEmail = props.institutionalEmail;
    this.admissionPeriod = props.admissionPeriod;
    this.status = props.status;

    Object.freeze(this);
  }

  static reconstitute(props: StudentProps): Student {
    return new Student(props);
  }

  static create(props: CreateStudentProps): Student {
    return new Student({
      ...props,
      institutionalEmail: props.institutionalEmail ?? null,
      admissionPeriod: props.admissionPeriod ?? null,
      status: props.status ?? StudentStatus.ACTIVE,
    });
  }

  canEnroll(): boolean {
    return this.status === StudentStatus.ACTIVE;
  }

  isActive(): boolean {
    return this.status === StudentStatus.ACTIVE;
  }

  isSuspended(): boolean {
    return this.status === StudentStatus.SUSPENDED;
  }

  isWithdrawn(): boolean {
    return this.status === StudentStatus.WITHDRAWN;
  }

  isGraduated(): boolean {
    return this.status === StudentStatus.GRADUATED;
  }
}
