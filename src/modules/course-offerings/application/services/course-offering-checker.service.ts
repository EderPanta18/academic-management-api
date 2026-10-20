import { Inject, Injectable } from '@nestjs/common';
import {
  COURSE_OFFERING_REPOSITORY_TOKEN,
  type ICourseOfferingChecker,
  type ICourseOfferingRepository,
} from '../ports';

@Injectable()
export class CourseOfferingChecker implements ICourseOfferingChecker {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_TOKEN)
    private readonly courseOfferingRepository: ICourseOfferingRepository,
  ) {}

  async exists(id: string): Promise<boolean> {
    return await this.courseOfferingRepository.exists(id);
  }

  async isOpen(id: string): Promise<boolean> {
    const courseOffering = await this.courseOfferingRepository.find(id);

    return courseOffering?.isOpen() ?? false;
  }
}
