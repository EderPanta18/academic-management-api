// modules/course-offerings/domain/entities/course-offering/course-offering.entity.ts

import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import type { CourseOfferingProps, CreateCourseOfferingProps } from './course-offering.types';

type CourseOfferingInternalProps = {
  id?: number;
  courseId: number;
  academicPeriodId: number;
  professorId?: number | null;
  section?: string | null;
  maxStudents?: number | null;
  enrollmentDeadline?: Date | null;
  status?: CourseOfferingStatus | null;
};

export class CourseOffering {
  readonly id?: number;
  readonly courseId: number;
  readonly academicPeriodId: number;
  readonly professorId: number | null;
  readonly section: string;
  readonly maxStudents: number;
  readonly enrollmentDeadline: Date | null;
  readonly status: CourseOfferingStatus;

  private constructor(props: CourseOfferingInternalProps) {
    this.id = props.id;
    this.courseId = props.courseId;
    this.academicPeriodId = props.academicPeriodId;
    this.professorId = props.professorId ?? null;
    this.section = props.section ?? 'A';
    this.maxStudents = props.maxStudents ?? 30;
    this.enrollmentDeadline = props.enrollmentDeadline ?? null;
    this.status = props.status ?? CourseOfferingStatus.INACTIVE;

    Object.freeze(this);
  }

  static create(props: CreateCourseOfferingProps): CourseOffering {
    return new CourseOffering(props);
  }

  static reconstitute(props: CourseOfferingProps): CourseOffering {
    return new CourseOffering(props);
  }

  get canAssignProfessor(): boolean {
    return (
      this.status === CourseOfferingStatus.ACTIVE || this.status === CourseOfferingStatus.INACTIVE
    );
  }

  get isOpenForEnrollment(): boolean {
    if (this.status !== CourseOfferingStatus.ACTIVE) return false;

    if (!this.enrollmentDeadline) return true;

    return new Date() <= this.enrollmentDeadline;
  }

  get isActive(): boolean {
    return this.status === CourseOfferingStatus.ACTIVE;
  }

  get isCancelled(): boolean {
    return this.status === CourseOfferingStatus.CANCELLED;
  }

  get isCompleted(): boolean {
    return this.status === CourseOfferingStatus.COMPLETED;
  }

  get hasProfessor(): boolean {
    return this.professorId !== null;
  }
}
