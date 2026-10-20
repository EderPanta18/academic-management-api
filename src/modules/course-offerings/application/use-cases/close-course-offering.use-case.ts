import type { CourseOffering } from '@course-offerings/domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import { CourseOfferingNotFoundException } from '../exceptions';
import { COURSE_OFFERING_REPOSITORY_TOKEN, type ICourseOfferingRepository } from '../ports/out';

@Injectable()
export class CloseCourseOfferingUseCase {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_TOKEN)
    private readonly courseOfferingRepository: ICourseOfferingRepository,
  ) {}

  async execute(id: string): Promise<CourseOffering> {
    const courseOffering = await this.courseOfferingRepository.find(id);

    if (!courseOffering) throw new CourseOfferingNotFoundException(id);

    const courseOfferingClosed = courseOffering.close();

    return await this.courseOfferingRepository.update(courseOfferingClosed);
  }
}
