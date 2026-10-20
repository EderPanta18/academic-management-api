import type { AcademicPeriodStatus } from '@academic-periods/domain/entities';

export type ListAcademicPeriodsQuery = {
  status?: AcademicPeriodStatus;
  search?: string;
};
