// modules/students/domain/entities/student/student.entity.ts

import { StudentStatus } from "@students/domain/constants";
import type { CreateStudentProps, StudentProps } from "./student.types";

interface StudentInternalProps {
  id?: number;
  careerId: number;
  code: string;
  institutionalEmail?: string | null;
  enrollmentDate: Date;
  status?: StudentStatus | null;
}

export class Student {
  readonly id?: number;
  readonly careerId: number;
  readonly code: string;
  readonly institutionalEmail: string | null;
  readonly enrollmentDate: Date;
  readonly status: StudentStatus;

  private constructor(props: StudentInternalProps) {
    this.id = props.id;
    this.careerId = props.careerId;
    this.code = props.code;
    this.institutionalEmail = props.institutionalEmail ?? null;
    this.enrollmentDate = props.enrollmentDate;
    this.status = props.status ?? StudentStatus.ACTIVE;

    Object.freeze(this);
  }

  static create(props: CreateStudentProps): Student {
    return new Student(props);
  }

  static reconstitute(props: StudentProps): Student {
    return new Student(props);
  }

  canEnroll(): boolean {
    return this.status === StudentStatus.ACTIVE;
  }

  isActive(): boolean {
    return this.status === StudentStatus.ACTIVE;
  }

  isGraduated(): boolean {
    return this.status === StudentStatus.GRADUATED;
  }

  isSuspended(): boolean {
    return this.status === StudentStatus.SUSPENDED;
  }
}
