import { COURSE_OFFERING } from './course-offering.constants';
import { CourseOfferingStatus } from './course-offering.enums';
import type { CourseOfferingProps, CreateCourseOfferingProps } from './course-offering.types';
import {
  CourseOfferingCannotOpenWithoutProfessorException,
  CourseOfferingInvalidAvailableCapacityException,
  CourseOfferingInvalidCapacityException,
  CourseOfferingInvalidSectionException,
  CourseOfferingNotAssignableException,
  CourseOfferingNotCancellableException,
  CourseOfferingNotClosableException,
  CourseOfferingNotFinishableException,
  CourseOfferingNotOpenableException,
} from './exceptions';

export class CourseOffering {
  readonly id: string;
  readonly courseId: string;
  readonly academicPeriodId: string;
  readonly professorId: string | null;
  readonly section: string;
  readonly maxCapacity: number;
  readonly availableCapacity: number | null;
  readonly status: CourseOfferingStatus;

  private constructor(props: CourseOfferingProps) {
    this.id = props.id;
    this.courseId = props.courseId;
    this.academicPeriodId = props.academicPeriodId;
    this.professorId = props.professorId;
    this.section = props.section;
    this.maxCapacity = props.maxCapacity;
    this.availableCapacity = props.availableCapacity;
    this.status = props.status;

    Object.freeze(this);
  }

  static reconstitute(props: CourseOfferingProps): CourseOffering {
    return new CourseOffering(props);
  }

  static create(props: CreateCourseOfferingProps): CourseOffering {
    if (props.maxCapacity < COURSE_OFFERING.maxCapacity.min)
      throw new CourseOfferingInvalidCapacityException(props.maxCapacity);

    if (
      props.availableCapacity !== null &&
      (props.availableCapacity < COURSE_OFFERING.availableCapacity.min ||
        props.availableCapacity > props.maxCapacity)
    )
      throw new CourseOfferingInvalidAvailableCapacityException(
        props.availableCapacity,
        props.maxCapacity,
      );

    const section = props.section.trim();

    if (
      section.length < COURSE_OFFERING.section.minLength ||
      section.length > COURSE_OFFERING.section.maxLength
    )
      throw new CourseOfferingInvalidSectionException(
        props.section,
        COURSE_OFFERING.section.minLength,
        COURSE_OFFERING.section.maxLength,
      );

    return new CourseOffering({
      ...props,
      section,
      status: COURSE_OFFERING.defaults.status,
    });
  }

  // ── Consultas de estado ───────────────────────────────────────────────────

  isDraft(): boolean {
    return this.status === CourseOfferingStatus.DRAFT;
  }

  isOpen(): boolean {
    return this.status === CourseOfferingStatus.OPEN;
  }

  isClosed(): boolean {
    return this.status === CourseOfferingStatus.CLOSED;
  }

  isCancelled(): boolean {
    return this.status === CourseOfferingStatus.CANCELLED;
  }

  isFinished(): boolean {
    return this.status === CourseOfferingStatus.FINISHED;
  }

  isTerminal(): boolean {
    return this.isCancelled() || this.isFinished();
  }

  hasProfessor(): boolean {
    return this.professorId !== null;
  }

  // ── Transiciones de estado ────────────────────────────────────────────────

  open(): CourseOffering {
    if (!this.isDraft()) throw new CourseOfferingNotOpenableException(this.id, this.status);

    if (!this.hasProfessor()) throw new CourseOfferingCannotOpenWithoutProfessorException(this.id);

    return new CourseOffering({
      ...this,
      status: CourseOfferingStatus.OPEN,
    });
  }

  close(): CourseOffering {
    if (!this.isOpen()) throw new CourseOfferingNotClosableException(this.id, this.status);

    return new CourseOffering({
      ...this,
      status: CourseOfferingStatus.CLOSED,
    });
  }

  finish(): CourseOffering {
    if (!this.isClosed()) throw new CourseOfferingNotFinishableException(this.id, this.status);

    return new CourseOffering({
      ...this,
      status: CourseOfferingStatus.FINISHED,
    });
  }

  cancel(): CourseOffering {
    if (this.isTerminal()) throw new CourseOfferingNotCancellableException(this.id, this.status);

    return new CourseOffering({
      ...this,
      status: CourseOfferingStatus.CANCELLED,
    });
  }

  // ── Modificaciones ────────────────────────────────────────────────────────

  assignProfessor(professorId: string): CourseOffering {
    if (!this.isDraft() && !this.isOpen())
      throw new CourseOfferingNotAssignableException(this.id, this.status);

    return new CourseOffering({
      ...this,
      professorId,
    });
  }
}
