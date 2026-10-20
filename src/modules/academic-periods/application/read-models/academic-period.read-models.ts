import type { AcademicPeriodStatus } from '@academic-periods/domain/entities';

export type AcademicPeriodReadModel = {
  id: string;
  code: string;
  name: string;
  startDate: Date;
  endDate: Date;
  enrollmentStartDate: Date | null;
  enrollmentEndDate: Date | null;
  status: AcademicPeriodStatus;
};
