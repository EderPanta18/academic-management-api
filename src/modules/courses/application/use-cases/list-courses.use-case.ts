// modules/courses/application/use-cases/list-courses.use-case.ts

import { PaginatedResultDto, PaginationVO } from '@core/pagination';
import { COURSE_REPOSITORY_PORT, type ICourseRepository } from '@courses/application/ports/out';
import { Course } from '@courses/domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import { ListCoursesQuery } from '../queries';

@Injectable()
export class ListCoursesUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY_PORT)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListCoursesQuery,
  ): Promise<PaginatedResultDto<Course>> {
    const [courses, total] = await this.courseRepository.findAll(pagination, {
      careerId: query.careerId,
      categoryId: query.categoryId,
    });

    return PaginatedResultDto.from(courses, total, pagination);
  }
}
