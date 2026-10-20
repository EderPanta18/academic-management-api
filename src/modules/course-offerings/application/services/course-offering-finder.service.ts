import { Inject, Injectable } from '@nestjs/common';
import {
  COURSE_OFFERING_REPOSITORY_TOKEN,
  type ICourseOfferingFinder,
  type ICourseOfferingRepository,
} from '../ports';

@Injectable()
export class CourseOfferingFinder implements ICourseOfferingFinder {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_TOKEN)
    private readonly courseOfferingRepository: ICourseOfferingRepository,
  ) {}

  async getCourseId(id: string): Promise<string | null> {
    const courseOffering = await this.courseOfferingRepository.find(id);

    return courseOffering?.courseId ?? null;
  }
}
