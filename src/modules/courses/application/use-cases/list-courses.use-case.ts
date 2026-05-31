// modules/courses/application/use-cases/list-courses.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { PaginationVO, PaginatedResultDto } from '@core/pagination';
import { Course } from '@courses/domain/entities';
import {
  COURSE_REPOSITORY_PORT,
  type ICourseRepository,
} from '@courses/domain/ports/out';
import { ListCoursesQuery } from '../queries';

@Injectable()
export class ListCoursesUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY_PORT)
    private readonly repository: ICourseRepository,
  ) {}

  async execute(
    pagination: PaginationVO,
    query?: ListCoursesQuery,
  ): Promise<PaginatedResultDto<Course>> {
    const [courses, total] = await this.repository.findAll(pagination, {
      careerId: query?.careerId,
      categoryId: query?.categoryId,
    });
    return PaginatedResultDto.from(courses, total, pagination);
  }
}
