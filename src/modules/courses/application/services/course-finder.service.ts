import { Inject, Injectable } from '@nestjs/common';
import { COURSE_REPOSITORY_TOKEN, type ICourseFinder, type ICourseRepository } from '../ports';

@Injectable()
export class CourseFinder implements ICourseFinder {
  constructor(
    @Inject(COURSE_REPOSITORY_TOKEN)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async getAcademicProgramId(id: string): Promise<string | null> {
    const course = await this.courseRepository.find(id);

    return course?.academicProgramId ?? null;
  }
}
