import type { AcademicPeriodReadModel } from '@academic-periods/application/read-models';
import type { AcademicPeriodStatus } from '@academic-periods/domain/entities';
import type { PaginationVO } from '@core/pagination';

export const ACADEMIC_PERIOD_QUERY_TOKEN = Symbol('ACADEMIC_PERIOD_QUERY');

export type AcademicPeriodQueryFilters = {
  status?: AcademicPeriodStatus;
  search?: string;
};

export interface IAcademicPeriodQuery {
  find(id: string): Promise<AcademicPeriodReadModel | null>;

  findAll(
    pagination: PaginationVO,
    filters?: AcademicPeriodQueryFilters,
  ): Promise<[AcademicPeriodReadModel[], number]>;
}
