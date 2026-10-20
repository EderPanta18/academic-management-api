import { AcademicPeriodStatus } from './academic-period.enums';

export const ACADEMIC_PERIOD = {
  defaults: {
    status: AcademicPeriodStatus.PLANNED,
  },
} as const;
