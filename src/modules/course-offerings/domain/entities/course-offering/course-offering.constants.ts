import { CourseOfferingStatus } from './course-offering.enums';

export const COURSE_OFFERING = {
  section: {
    minLength: 1,
    maxLength: 20,
  },
  maxCapacity: {
    min: 1,
  },
  availableCapacity: {
    min: 0,
  },
  defaults: {
    status: CourseOfferingStatus.DRAFT,
  },
} as const;
