import type { AcademicPeriod } from '@academic-periods/domain/entities';

export const ACADEMIC_PERIOD_REPOSITORY_TOKEN = Symbol('ACADEMIC_PERIOD_REPOSITORY');

export interface IAcademicPeriodRepository {
  create(period: AcademicPeriod): Promise<AcademicPeriod>;

  update(period: AcademicPeriod): Promise<AcademicPeriod>;

  find(id: string): Promise<AcademicPeriod | null>;

  exists(id: string): Promise<boolean>;

  existsByCode(code: string): Promise<boolean>;
}
