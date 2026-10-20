import type { AcademicPeriodStatus } from './academic-period.enums';

export type AcademicPeriodProps = {
  id: string;
  code: string;
  name: string;
  startDate: Date;
  endDate: Date;
  enrollmentStartDate: Date | null;
  enrollmentEndDate: Date | null;
  status: AcademicPeriodStatus;
};

export type CreateAcademicPeriodProps = {
  id: string;
  code: string;
  name: string;
  startDate: Date;
  endDate: Date;
  enrollmentStartDate: Date | null;
  enrollmentEndDate: Date | null;
  status: AcademicPeriodStatus | null;
};
