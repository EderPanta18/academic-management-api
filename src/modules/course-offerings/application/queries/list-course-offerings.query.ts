// modules/course-offerings/application/queries/list-course-offerings.query.ts

import { CourseOfferingStatus } from "@course-offerings/domain/constants";

interface ListCourseOfferingsQueryProps {
  courseId?: number;
  academicPeriodId?: number;
  statuses?: CourseOfferingStatus | CourseOfferingStatus[];
}

export class ListCourseOfferingsQuery {
  readonly courseId?: number;
  readonly academicPeriodId?: number;
  readonly statuses?: CourseOfferingStatus[];

  constructor(props: ListCourseOfferingsQueryProps) {
    this.courseId = props.courseId;
    this.academicPeriodId = props.academicPeriodId;
    this.statuses =
      props.statuses === undefined
        ? undefined
        : Array.isArray(props.statuses)
          ? props.statuses
          : [props.statuses];
  }
}
