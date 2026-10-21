import type { PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { ENROLLMENT_QUERY_TOKEN, type IEnrollmentQuery } from '../ports/out';
import type { ListEnrollmentsQuery } from '../queries';
import type { EnrollmentReadModel } from '../read-models';

@Injectable()
export class ListEnrollmentsUseCase {
  constructor(
    @Inject(ENROLLMENT_QUERY_TOKEN)
    private readonly enrollmentQuery: IEnrollmentQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListEnrollmentsQuery = {},
  ): Promise<[EnrollmentReadModel[], number]> {
    return await this.enrollmentQuery.findAll(pagination, {
      studentId: query.studentId,
      courseOfferingId: query.courseOfferingId,
      academicPeriodId: query.academicPeriodId,
      statuses: query.statuses,
      search: query.search,
    });
  }
}
