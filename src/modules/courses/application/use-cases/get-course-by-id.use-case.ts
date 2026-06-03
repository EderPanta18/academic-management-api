// modules/courses/application/use-cases/get-course-by-id.use-case.ts

import { COURSE_REPOSITORY_PORT, type ICourseRepository } from '@courses/application/ports/out';
import { Course } from '@courses/domain/entities';
import { CourseNotFoundException } from '@courses/domain/exceptions';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetCourseByIdUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY_PORT)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: number): Promise<Course> {
    const course = await this.courseRepository.findById(id);

    if (!course) throw new CourseNotFoundException(id);

    return course;
  }
}
