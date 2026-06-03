// modules/enrollments/domain/entities/enrollment.entity.ts

import { EnrollmentStatus } from "@enrollments/domain/constants";
import type {
  EnrollmentProps,
  CreateEnrollmentProps
} from "./enrollment.types";

type EnrollmentInternalProps = {
  id?: number;
  studentId: number;
  courseOfferingId: number;
  status?: EnrollmentStatus;
  enrollmentDate: Date;
  createdBy?: number | null;
};

export class Enrollment {
  readonly id?: number;
  readonly studentId: number;
  readonly courseOfferingId: number;
  readonly status: EnrollmentStatus;
  readonly enrollmentDate: Date;
  readonly createdBy: number | null;

  private constructor(props: EnrollmentInternalProps) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.courseOfferingId = props.courseOfferingId;
    this.status = props.status ?? EnrollmentStatus.ENROLLED;
    this.enrollmentDate = props.enrollmentDate;
    this.createdBy = props.createdBy ?? null;

    Object.freeze(this);
  }

  static create(props: CreateEnrollmentProps): Enrollment {
    return new Enrollment(props);
  }

  static reconstitute(props: EnrollmentProps): Enrollment {
    return new Enrollment(props);
  }

  get canWithdraw(): boolean {
    return this.status === EnrollmentStatus.ENROLLED;
  }

  get canComplete(): boolean {
    return this.status === EnrollmentStatus.ENROLLED;
  }

  get canSuspend(): boolean {
    return this.status === EnrollmentStatus.ENROLLED;
  }

  get canReactivate(): boolean {
    return this.status === EnrollmentStatus.SUSPENDED;
  }

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

  get isTerminal(): boolean {
    return (
      this.status === EnrollmentStatus.WITHDRAWN ||
      this.status === EnrollmentStatus.COMPLETED
    );
  }
}
