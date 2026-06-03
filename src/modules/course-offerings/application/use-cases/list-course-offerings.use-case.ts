// modules/course-offerings/application/use-cases/list-course-offerings.use-case.ts

import { PaginatedResultDto, PaginationVO } from '@core/pagination';
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository,
} from '@course-offerings/application/ports/out';
import { CourseOffering } from '@course-offerings/domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import { ListCourseOfferingsQuery } from '../queries';

@Injectable()
export class ListCourseOfferingsUseCase {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_PORT)
    private readonly repository: ICourseOfferingRepository,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListCourseOfferingsQuery,
  ): Promise<PaginatedResultDto<CourseOffering>> {
    const [offerings, total] = await this.repository.findAll(pagination, {
      courseId: query.courseId,
      academicPeriodId: query.academicPeriodId,
      statuses: query.statuses,
    });

    return PaginatedResultDto.from(offerings, total, pagination);
  }
}
