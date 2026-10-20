import type { CourseOffering } from '@course-offerings/domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import { type IProfessorChecker, PROFESSOR_CHECKER_TOKEN } from '@professors/application/ports/in';
import type { AssignProfessorToOfferingCommand } from '../commands';
import {
  CourseOfferingNotFoundException,
  CourseOfferingProfessorNotActiveException,
  CourseOfferingProfessorNotFoundException,
} from '../exceptions';
import { COURSE_OFFERING_REPOSITORY_TOKEN, type ICourseOfferingRepository } from '../ports/out';

@Injectable()
export class AssignProfessorToOfferingUseCase {
  constructor(
    @Inject(PROFESSOR_CHECKER_TOKEN)
    private readonly professorChecker: IProfessorChecker,

    @Inject(COURSE_OFFERING_REPOSITORY_TOKEN)
    private readonly courseOfferingRepository: ICourseOfferingRepository,
  ) {}

  async execute(command: AssignProfessorToOfferingCommand): Promise<CourseOffering> {
    const courseOffering = await this.courseOfferingRepository.find(command.offeringId);

    if (!courseOffering) throw new CourseOfferingNotFoundException(command.offeringId);

    const professorExists = await this.professorChecker.exists(command.professorId);

    if (!professorExists) throw new CourseOfferingProfessorNotFoundException(command.professorId);

    const professorIsActive = await this.professorChecker.isActive(command.professorId);

    if (!professorIsActive)
      throw new CourseOfferingProfessorNotActiveException(command.professorId, command.offeringId);

    const courseOfferingUpdated = courseOffering.assignProfessor(command.professorId);

    return await this.courseOfferingRepository.update(courseOfferingUpdated);
  }
}
