import { Inject, Injectable } from '@nestjs/common';
import { CourseNotFoundException } from '../exceptions';
import { COURSE_QUERY_TOKEN, type ICourseQuery } from '../ports/out';
import type { CourseReadModel } from '../read-models';

@Injectable()
export class GetCourseByIdUseCase {
  constructor(
    @Inject(COURSE_QUERY_TOKEN)
    private readonly courseQuery: ICourseQuery,
  ) {}

  async execute(id: string): Promise<CourseReadModel> {
    const readModel = await this.courseQuery.find(id);

    if (!readModel) throw new CourseNotFoundException(id);

    return readModel;
  }
}
