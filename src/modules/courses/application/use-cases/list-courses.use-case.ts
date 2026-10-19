import type { PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { COURSE_QUERY_TOKEN, type ICourseQuery } from '../ports/out';
import type { ListCoursesQuery } from '../queries';
import type { CourseReadModel } from '../read-models';

@Injectable()
export class ListCoursesUseCase {
  constructor(
    @Inject(COURSE_QUERY_TOKEN)
    private readonly courseQuery: ICourseQuery,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListCoursesQuery = {},
  ): Promise<[CourseReadModel[], number]> {
    return await this.courseQuery.findAll(pagination, {
      academicProgramId: query.academicProgramId,
      courseCategoryId: query.courseCategoryId,
      search: query.search,
    });
  }
}
