import type { PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { ACADEMIC_PERIOD_QUERY_TOKEN, type IAcademicPeriodQuery } from '../ports/out';
import type { ListAcademicPeriodsQuery } from '../queries';
import type { AcademicPeriodReadModel } from '../read-models';

@Injectable()
export class ListAcademicPeriodsUseCase {
  constructor(
    @Inject(ACADEMIC_PERIOD_QUERY_TOKEN)
    private readonly academicPeriodQuery: IAcademicPeriodQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListAcademicPeriodsQuery = {},
  ): Promise<[AcademicPeriodReadModel[], number]> {
    return await this.academicPeriodQuery.findAll(pagination, {
      status: query.status,
      search: query.search,
    });
  }
}
