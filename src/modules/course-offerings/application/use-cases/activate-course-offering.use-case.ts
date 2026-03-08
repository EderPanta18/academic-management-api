// modules/course-offerings/application/use-cases/activate-course-offering.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import { CourseOffering } from '@course-offerings/domain/entities';
import {
  CourseOfferingNotFoundException,
  CourseOfferingInvalidStatusException,
  CourseOfferingNoProfessorException,
} from '@course-offerings/domain/exceptions';
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository,
} from '@course-offerings/domain/ports/out';

@Injectable()
export class ActivateCourseOfferingUseCase {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_PORT)
    private readonly repository: ICourseOfferingRepository,
  ) {}

  async execute(id: number): Promise<CourseOffering> {
    const offering = await this.repository.findById(id);

    if (!offering) {
      throw new CourseOfferingNotFoundException(id);
    }

    // Solo INACTIVE puede activarse
    if (offering.status !== CourseOfferingStatus.INACTIVE) {
      throw new CourseOfferingInvalidStatusException(
        offering.id!,
        offering.status,
        [CourseOfferingStatus.INACTIVE],
      );
    }

    // Debe tener un profesor asignado antes de activarse
    if (!offering.hasProfessor) {
      throw new CourseOfferingNoProfessorException(id);
    }

    return this.repository.activate(id);
  }
}
