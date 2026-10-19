import { AcademicPeriodStatus } from './academic-period.enums';
import type { AcademicPeriodProps, CreateAcademicPeriodProps } from './academic-period.types';
import {
  AcademicPeriodInvalidDateRangeException,
  AcademicPeriodInvalidEnrollmentDateRangeException,
  AcademicPeriodNotCancellableException,
  AcademicPeriodNotClosableException,
  AcademicPeriodNotOpenableException,
  AcademicPeriodNotStartableException,
} from './exceptions';

export class AcademicPeriod {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly enrollmentStartDate: Date | null;
  readonly enrollmentEndDate: Date | null;
  readonly status: AcademicPeriodStatus;

  private constructor(props: AcademicPeriodProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.enrollmentStartDate = props.enrollmentStartDate;
    this.enrollmentEndDate = props.enrollmentEndDate;
    this.status = props.status;

    Object.freeze(this);
  }

  static reconstitute(props: AcademicPeriodProps): AcademicPeriod {
    return new AcademicPeriod(props);
  }

  static create(props: CreateAcademicPeriodProps): AcademicPeriod {
    if (props.endDate < props.startDate) throw new AcademicPeriodInvalidDateRangeException();

    if (
      props.enrollmentStartDate !== null &&
      props.enrollmentEndDate !== null &&
      props.enrollmentEndDate < props.enrollmentStartDate
    )
      throw new AcademicPeriodInvalidEnrollmentDateRangeException();

    return new AcademicPeriod({
      ...props,
      status: props.status ?? AcademicPeriodStatus.PLANNED,
    });
  }

  // ── Consultas de estado ───────────────────────────────────────────────────

  isPlanned(): boolean {
    return this.status === AcademicPeriodStatus.PLANNED;
  }

  isOpen(): boolean {
    return this.status === AcademicPeriodStatus.OPEN;
  }

  isInProgress(): boolean {
    return this.status === AcademicPeriodStatus.IN_PROGRESS;
  }

  isClosed(): boolean {
    return this.status === AcademicPeriodStatus.CLOSED;
  }

  isCancelled(): boolean {
    return this.status === AcademicPeriodStatus.CANCELLED;
  }

  isTerminal(): boolean {
    return this.isClosed() || this.isCancelled();
  }

  isCurrent(referenceDate: Date = new Date()): boolean {
    return this.startDate <= referenceDate && referenceDate <= this.endDate;
  }

  allowsEnrollment(referenceDate: Date = new Date()): boolean {
    if (!this.isOpen()) return false;

    if (this.enrollmentStartDate !== null && referenceDate < this.enrollmentStartDate) return false;

    if (this.enrollmentEndDate !== null && referenceDate > this.enrollmentEndDate) return false;

    return true;
  }

  // ── Transiciones de estado ────────────────────────────────────────────────

  open(): AcademicPeriod {
    if (!this.isPlanned()) throw new AcademicPeriodNotOpenableException(this.id, this.status);

    return new AcademicPeriod({
      ...this,
      status: AcademicPeriodStatus.OPEN,
    });
  }

  start(): AcademicPeriod {
    if (!this.isOpen()) throw new AcademicPeriodNotStartableException(this.id, this.status);

    return new AcademicPeriod({
      ...this,
      status: AcademicPeriodStatus.IN_PROGRESS,
    });
  }

  close(): AcademicPeriod {
    if (!this.isOpen() && !this.isInProgress())
      throw new AcademicPeriodNotClosableException(this.id, this.status);

    return new AcademicPeriod({
      ...this,
      status: AcademicPeriodStatus.CLOSED,
    });
  }

  cancel(): AcademicPeriod {
    if (this.isTerminal()) throw new AcademicPeriodNotCancellableException(this.id, this.status);

    return new AcademicPeriod({
      ...this,
      status: AcademicPeriodStatus.CANCELLED,
    });
  }
}
