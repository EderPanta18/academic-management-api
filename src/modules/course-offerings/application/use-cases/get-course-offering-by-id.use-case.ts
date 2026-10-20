import { Inject, Injectable } from '@nestjs/common';
import { CourseOfferingNotFoundException } from '../exceptions';
import { COURSE_OFFERING_QUERY_TOKEN, type ICourseOfferingQuery } from '../ports/out';
import type { CourseOfferingReadModel } from '../read-models';

@Injectable()
export class GetCourseOfferingByIdUseCase {
  constructor(
    @Inject(COURSE_OFFERING_QUERY_TOKEN)
    private readonly courseOfferingQuery: ICourseOfferingQuery,
  ) {}

  async execute(id: string): Promise<CourseOfferingReadModel> {
    const readModel = await this.courseOfferingQuery.find(id);

    if (!readModel) throw new CourseOfferingNotFoundException(id);

    return readModel;
  }
}
