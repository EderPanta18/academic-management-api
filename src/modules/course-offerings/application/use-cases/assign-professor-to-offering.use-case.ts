// modules/course-offerings/application/use-cases/assign-professor-to-offering.use-case.ts

import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@core/exceptions";
import {
  PROFESSOR_FINDER_PORT,
  type IProfessorFinder
} from "@professors/application/ports/in";
import { CourseOfferingStatus } from "@course-offerings/domain/constants";
import { CourseOffering } from "@course-offerings/domain/entities";
import {
  CourseOfferingNotFoundException,
  CourseOfferingInvalidStatusException
} from "@course-offerings/domain/exceptions";
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository
} from "@course-offerings/application/ports/out";
import { ProfessorNotActiveForAssignmentException } from "../exceptions";
import { AssignProfessorToOfferingCommand } from "../commands";

@Injectable()
export class AssignProfessorToOfferingUseCase {
  constructor(
    @Inject(PROFESSOR_FINDER_PORT)
    private readonly professorFinder: IProfessorFinder,

    @Inject(COURSE_OFFERING_REPOSITORY_PORT)
    private readonly courseOfferingrepository: ICourseOfferingRepository
  ) {}

  async execute(
    command: AssignProfessorToOfferingCommand
  ): Promise<CourseOffering> {
    const offering = await this.courseOfferingrepository.findById(
      command.offeringId
    );
    if (!offering)
      throw new CourseOfferingNotFoundException(command.offeringId);

    if (!offering.canAssignProfessor)
      throw new CourseOfferingInvalidStatusException(
        command.offeringId,
        offering.status,
        [CourseOfferingStatus.INACTIVE, CourseOfferingStatus.ACTIVE]
      );

    const professorExists = await this.professorFinder.exists(
      command.professorId
    );

    if (!professorExists)
      throw new EntityNotFoundException("Professor", command.professorId);

    const isProfessorActive = await this.professorFinder.isActive(
      command.professorId
    );

    if (!isProfessorActive)
      throw new ProfessorNotActiveForAssignmentException(command.professorId);

    return this.courseOfferingrepository.assignProfessor(
      command.offeringId,
      command.professorId
    );
  }
}
