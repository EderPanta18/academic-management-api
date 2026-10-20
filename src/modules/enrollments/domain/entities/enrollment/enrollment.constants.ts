import { EnrollmentStatus } from './enrollment.enums';

export const ENROLLMENT = {
  defaults: {
    status: EnrollmentStatus.ENROLLED,
  },
} as const;
