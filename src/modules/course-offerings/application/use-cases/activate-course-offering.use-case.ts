// modules/course-offerings/application/use-cases/activate-course-offering.use-case.ts

import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository,
} from '@course-offerings/application/ports/out';
import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import { CourseOffering } from '@course-offerings/domain/entities';
import {
  CourseOfferingInvalidStatusException,
  CourseOfferingNoProfessorException,
  CourseOfferingNotFoundException,
} from '@course-offerings/domain/exceptions';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ActivateCourseOfferingUseCase {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_PORT)
    private readonly courseOfferingrepository: ICourseOfferingRepository,
  ) {}

  async execute(id: number): Promise<CourseOffering> {
    const offering = await this.courseOfferingrepository.findById(id);

    if (!offering) throw new CourseOfferingNotFoundException(id);

    if (offering.status !== CourseOfferingStatus.INACTIVE) {
      throw new CourseOfferingInvalidStatusException(offering.id!, offering.status, [
        CourseOfferingStatus.INACTIVE,
      ]);
    }

    if (!offering.hasProfessor) throw new CourseOfferingNoProfessorException(id);

    return this.courseOfferingrepository.activate(id);
  }
}
