import { STUDENT } from './student.constants';
import { StudentStatus } from './student.enums';
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
      status: props.status ?? STUDENT.defaults.status,
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
