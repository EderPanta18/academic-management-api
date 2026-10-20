import type { CourseOffering } from '@course-offerings/domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import { CourseOfferingNotFoundException } from '../exceptions';
import { COURSE_OFFERING_REPOSITORY_TOKEN, type ICourseOfferingRepository } from '../ports/out';

@Injectable()
export class CancelCourseOfferingUseCase {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_TOKEN)
    private readonly courseOfferingRepository: ICourseOfferingRepository,
  ) {}

  async execute(id: string): Promise<CourseOffering> {
    const courseOffering = await this.courseOfferingRepository.find(id);

    if (!courseOffering) throw new CourseOfferingNotFoundException(id);

    const courseOfferingCancelled = courseOffering.cancel();

    return await this.courseOfferingRepository.update(courseOfferingCancelled);
  }
}
