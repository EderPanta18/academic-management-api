import type { PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { COURSE_OFFERING_QUERY_TOKEN, type ICourseOfferingQuery } from '../ports/out';
import type { ListCourseOfferingsQuery } from '../queries';
import type { CourseOfferingReadModel } from '../read-models';

@Injectable()
export class ListCourseOfferingsUseCase {
  constructor(
    @Inject(COURSE_OFFERING_QUERY_TOKEN)
    private readonly courseOfferingQuery: ICourseOfferingQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListCourseOfferingsQuery = {},
  ): Promise<[CourseOfferingReadModel[], number]> {
    return await this.courseOfferingQuery.findAll(pagination, {
      courseId: query.courseId,
      academicPeriodId: query.academicPeriodId,
      professorId: query.professorId,
      statuses: query.statuses,
      search: query.search,
    });
  }
}
