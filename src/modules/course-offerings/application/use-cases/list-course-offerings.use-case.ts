// modules/course-offerings/application/use-cases/list-course-offerings.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { CourseOffering } from '@course-offerings/domain/entities';
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository,
} from '@course-offerings/domain/ports/out';
import { ListCourseOfferingsQuery } from '../queries';

@Injectable()
export class ListCourseOfferingsUseCase {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_PORT)
    private readonly repository: ICourseOfferingRepository,
  ) {}

  async execute(
    pagination: PaginationVO,
    query?: ListCourseOfferingsQuery,
  ): Promise<PaginatedResultDto<CourseOffering>> {
    const [offerings, total] = await this.repository.findAll(pagination, {
      courseId: query?.courseId,
      academicPeriodId: query?.academicPeriodId,
      statuses: query?.normalizedStatuses,
    });
    return PaginatedResultDto.from(offerings, total, pagination);
  }
}
