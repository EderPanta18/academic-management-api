// modules/course-offerings/application/use-cases/get-course-offering-by-id.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { CourseOffering } from '@course-offerings/domain/entities';
import { CourseOfferingNotFoundException } from '@course-offerings/domain/exceptions';
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository,
} from '@course-offerings/domain/ports';

@Injectable()
export class GetCourseOfferingByIdUseCase {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_PORT)
    private readonly repository: ICourseOfferingRepository,
  ) {}

  async execute(id: number): Promise<CourseOffering> {
    const offering = await this.repository.findById(id);
    if (!offering) throw new CourseOfferingNotFoundException(id);
    return offering;
  }
}
