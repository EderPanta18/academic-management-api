import { EnrollmentStatus } from '../enrollment';
import type {
  CreateEnrollmentStatusLogProps,
  EnrollmentStatusLogProps,
} from './enrollment-status-log.types';
import { EnrollmentStatusLogSameStatusException } from './exceptions';

export class EnrollmentStatusLog {
  readonly id: string;
  readonly enrollmentId: string;
  readonly previousStatus: EnrollmentStatus | null;
  readonly newStatus: EnrollmentStatus;
  readonly reason: string | null;
  readonly changedByUserId: string;
  readonly createdAt: Date;

  private constructor(props: EnrollmentStatusLogProps) {
    this.id = props.id;
    this.enrollmentId = props.enrollmentId;
    this.previousStatus = props.previousStatus;
    this.newStatus = props.newStatus;
    this.reason = props.reason;
    this.changedByUserId = props.changedByUserId;
    this.createdAt = props.createdAt;

    Object.freeze(this);
  }

  static reconstitute(props: EnrollmentStatusLogProps): EnrollmentStatusLog {
    return new EnrollmentStatusLog(props);
  }

  static create(props: CreateEnrollmentStatusLogProps): EnrollmentStatusLog {
    if (props.previousStatus !== null && props.previousStatus === props.newStatus)
      throw new EnrollmentStatusLogSameStatusException(props.previousStatus);

    return new EnrollmentStatusLog({
      ...props,
      createdAt: new Date(),
    });
  }

  isInitialTransition(): boolean {
    return this.previousStatus === null;
  }

  hasReason(): boolean {
    return this.reason !== null && this.reason.trim().length > 0;
  }
}
