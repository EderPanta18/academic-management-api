// modules/course-offerings/application/queries/list-course-offerings.query.ts

import { CourseOfferingStatus } from "@course-offerings/domain/constants";

interface ListCourseOfferingsQueryProps {
  courseId?: number;
  academicPeriodId?: number;
  status?: CourseOfferingStatus | CourseOfferingStatus[];
}

export class ListCourseOfferingsQuery {
  readonly courseId?: number;
  readonly academicPeriodId?: number;
  readonly status?: CourseOfferingStatus | CourseOfferingStatus[];

  constructor(props: ListCourseOfferingsQueryProps) {
    this.courseId = props.courseId;
    this.academicPeriodId = props.academicPeriodId;
    this.status = props.status;
  }

  get normalizedStatuses(): CourseOfferingStatus[] | undefined {
    if (this.status === undefined) return undefined;

    return Array.isArray(this.status) ? this.status : [this.status];
  }
}
