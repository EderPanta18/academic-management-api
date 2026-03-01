// modules/courses/application/use-cases/get-course-by-id.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { Course } from '@courses/domain/entities';
import { CourseNotFoundException } from '@courses/domain/exceptions';
import {
  COURSE_REPOSITORY_PORT,
  type ICourseRepository,
} from '@courses/domain/ports';

@Injectable()
export class GetCourseByIdUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY_PORT)
    private readonly repository: ICourseRepository,
  ) {}

  async execute(id: number): Promise<Course> {
    const course = await this.repository.findById(id);
    if (!course) throw new CourseNotFoundException(id);
    return course;
  }
}
