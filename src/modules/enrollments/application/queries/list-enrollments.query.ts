// modules/enrollments/application/queries/list-enrollments.query.ts

import { EnrollmentStatus } from "@enrollments/domain/constants";

interface ListEnrollmentsQueryProps {
  studentId?: number;
  courseOfferingId?: number;
  statuses?: EnrollmentStatus | EnrollmentStatus[];
}

export class ListEnrollmentsQuery {
  readonly studentId?: number;
  readonly courseOfferingId?: number;
  readonly statuses?: EnrollmentStatus[];

  constructor(props: ListEnrollmentsQueryProps) {
    this.studentId = props.studentId;
    this.courseOfferingId = props.courseOfferingId;
    this.statuses =
      props.statuses === undefined
        ? undefined
        : Array.isArray(props.statuses)
          ? props.statuses
          : [props.statuses];
  }
}
