// modules/course-offerings/application/use-cases/assign-professor-to-offering.use-case.ts

import { EntityNotFoundException } from '@core/exceptions';
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository,
} from '@course-offerings/application/ports/out';
import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import type { CourseOffering } from '@course-offerings/domain/entities';
import {
  CourseOfferingInvalidStatusException,
  CourseOfferingNotFoundException,
} from '@course-offerings/domain/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { type IProfessorFinder, PROFESSOR_FINDER_PORT } from '@professors/application/ports/in';
import type { AssignProfessorToOfferingCommand } from '../commands';
import { ProfessorNotActiveForAssignmentException } from '../exceptions';

@Injectable()
export class AssignProfessorToOfferingUseCase {
  constructor(
    @Inject(PROFESSOR_FINDER_PORT)
    private readonly professorFinder: IProfessorFinder,

    @Inject(COURSE_OFFERING_REPOSITORY_PORT)
    private readonly courseOfferingrepository: ICourseOfferingRepository,
  ) {}

  async execute(command: AssignProfessorToOfferingCommand): Promise<CourseOffering> {
    const offering = await this.courseOfferingrepository.findById(command.offeringId);
    if (!offering) throw new CourseOfferingNotFoundException(command.offeringId);

    if (!offering.canAssignProfessor)
      throw new CourseOfferingInvalidStatusException(command.offeringId, offering.status, [
        CourseOfferingStatus.INACTIVE,
        CourseOfferingStatus.ACTIVE,
      ]);

    const professorExists = await this.professorFinder.exists(command.professorId);

    if (!professorExists) throw new EntityNotFoundException('Professor', command.professorId);

    const isProfessorActive = await this.professorFinder.isActive(command.professorId);

    if (!isProfessorActive) throw new ProfessorNotActiveForAssignmentException(command.professorId);

    return this.courseOfferingrepository.assignProfessor(command.offeringId, command.professorId);
  }
}
