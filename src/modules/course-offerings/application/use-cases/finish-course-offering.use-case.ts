import type { CourseOffering } from '@course-offerings/domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import { CourseOfferingNotFoundException } from '../exceptions';
import { COURSE_OFFERING_REPOSITORY_TOKEN, type ICourseOfferingRepository } from '../ports/out';

@Injectable()
export class FinishCourseOfferingUseCase {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_TOKEN)
    private readonly courseOfferingRepository: ICourseOfferingRepository,
  ) {}

  async execute(id: string): Promise<CourseOffering> {
    const courseOffering = await this.courseOfferingRepository.find(id);

    if (!courseOffering) throw new CourseOfferingNotFoundException(id);

    const courseOfferingFinished = courseOffering.finish();

    return await this.courseOfferingRepository.update(courseOfferingFinished);
  }
}
