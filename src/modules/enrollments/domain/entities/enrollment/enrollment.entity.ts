import { ENROLLMENT } from './enrollment.constants';
import { EnrollmentStatus } from './enrollment.enums';
import type { CreateEnrollmentProps, EnrollmentProps } from './enrollment.types';
import {
  EnrollmentNotCancellableException,
  EnrollmentNotConfirmableException,
  EnrollmentNotFinishableException,
  EnrollmentNotRejectableException,
  EnrollmentNotWithdrawableException,
} from './exceptions';

export class Enrollment {
  readonly id: string;
  readonly studentId: string;
  readonly courseOfferingId: string;
  readonly registeredByUserId: string;
  readonly status: EnrollmentStatus;
  readonly enrolledAt: Date;
  readonly statusReason: string | null;

  private constructor(props: EnrollmentProps) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.courseOfferingId = props.courseOfferingId;
    this.registeredByUserId = props.registeredByUserId;
    this.status = props.status;
    this.enrolledAt = props.enrolledAt;
    this.statusReason = props.statusReason;

    Object.freeze(this);
  }

  static reconstitute(props: EnrollmentProps): Enrollment {
    return new Enrollment(props);
  }

  static create(props: CreateEnrollmentProps): Enrollment {
    return new Enrollment({
      ...props,
      status: props.status ?? ENROLLMENT.defaults.status,
    });
  }

  // ── Consultas de estado ───────────────────────────────────────────────────

  isPending(): boolean {
    return this.status === EnrollmentStatus.PENDING;
  }

  isEnrolled(): boolean {
    return this.status === EnrollmentStatus.ENROLLED;
  }

  isCancelled(): boolean {
    return this.status === EnrollmentStatus.CANCELLED;
  }

  isWithdrawn(): boolean {
    return this.status === EnrollmentStatus.WITHDRAWN;
  }

  isRejected(): boolean {
    return this.status === EnrollmentStatus.REJECTED;
  }

  isFinished(): boolean {
    return this.status === EnrollmentStatus.FINISHED;
  }

  isActive(): boolean {
    return this.status === EnrollmentStatus.ENROLLED;
  }

  isTerminal(): boolean {
    return this.isCancelled() || this.isWithdrawn() || this.isRejected() || this.isFinished();
  }

  // ── Transiciones de estado ────────────────────────────────────────────────

  confirm(): Enrollment {
    if (!this.isPending()) throw new EnrollmentNotConfirmableException(this.id, this.status);

    return new Enrollment({
      ...this,
      status: EnrollmentStatus.ENROLLED,
      statusReason: null,
    });
  }

  cancel(reason: string | null): Enrollment {
    if (!this.isPending() && !this.isEnrolled())
      throw new EnrollmentNotCancellableException(this.id, this.status);

    return new Enrollment({
      ...this,
      status: EnrollmentStatus.CANCELLED,
      statusReason: reason,
    });
  }

  withdraw(reason: string | null): Enrollment {
    if (!this.isEnrolled()) throw new EnrollmentNotWithdrawableException(this.id, this.status);

    return new Enrollment({
      ...this,
      status: EnrollmentStatus.WITHDRAWN,
      statusReason: reason,
    });
  }

  reject(reason: string | null): Enrollment {
    if (!this.isPending()) throw new EnrollmentNotRejectableException(this.id, this.status);

    return new Enrollment({
      ...this,
      status: EnrollmentStatus.REJECTED,
      statusReason: reason,
    });
  }

  finish(reason: string | null): Enrollment {
    if (!this.isEnrolled()) throw new EnrollmentNotFinishableException(this.id, this.status);

    return new Enrollment({
      ...this,
      status: EnrollmentStatus.FINISHED,
      statusReason: reason,
    });
  }
}
