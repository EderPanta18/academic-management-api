import type { AcademicPeriodStatus } from './academic-period.enums';

export interface AcademicPeriodProps {
  id: string;
  code: string;
  name: string;
  startDate: Date;
  endDate: Date;
  enrollmentStartDate: Date | null;
  enrollmentEndDate: Date | null;
  status: AcademicPeriodStatus;
}

export interface CreateAcademicPeriodProps {
  id: string;
  code: string;
  name: string;
  startDate: Date;
  endDate: Date;
  enrollmentStartDate: Date | null;
  enrollmentEndDate: Date | null;
  status: AcademicPeriodStatus | null;
}
