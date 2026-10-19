import { Inject, Injectable } from '@nestjs/common';
import { COURSE_REPOSITORY_TOKEN, type ICourseChecker, type ICourseRepository } from '../ports';

@Injectable()
export class CourseChecker implements ICourseChecker {
  constructor(
    @Inject(COURSE_REPOSITORY_TOKEN)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async exists(id: string): Promise<boolean> {
    return await this.courseRepository.exists(id);
  }
}
