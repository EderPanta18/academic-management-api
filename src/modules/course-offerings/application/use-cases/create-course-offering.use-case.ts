import { ACADEMIC_PERIOD_CHECKER_TOKEN, type IAcademicPeriodChecker } from '@academic-periods';
import { ID_GENERATOR_TOKEN, type IIdGenerator } from '@core/contracts';
import { CourseOffering } from '@course-offerings/domain/entities';
import { COURSE_CHECKER_TOKEN, type ICourseChecker } from '@courses';
import { Inject, Injectable } from '@nestjs/common';
import { type IProfessorChecker, PROFESSOR_CHECKER_TOKEN } from '@professors';
import type { CreateCourseOfferingCommand } from '../commands';
import {
  CourseOfferingAcademicPeriodNotFoundException,
  CourseOfferingAcademicPeriodNotOpenException,
  CourseOfferingCourseNotFoundException,
  CourseOfferingProfessorNotActiveException,
  CourseOfferingProfessorNotFoundException,
  CourseOfferingSectionAlreadyExistsException,
} from '../exceptions';
import { COURSE_OFFERING_REPOSITORY_TOKEN, type ICourseOfferingRepository } from '../ports/out';

@Injectable()
export class CreateCourseOfferingUseCase {
  constructor(
    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(COURSE_CHECKER_TOKEN)
    private readonly courseChecker: ICourseChecker,

    @Inject(ACADEMIC_PERIOD_CHECKER_TOKEN)
    private readonly academicPeriodChecker: IAcademicPeriodChecker,

    @Inject(PROFESSOR_CHECKER_TOKEN)
    private readonly professorChecker: IProfessorChecker,

    @Inject(COURSE_OFFERING_REPOSITORY_TOKEN)
    private readonly courseOfferingRepository: ICourseOfferingRepository,
  ) {}

  async execute(command: CreateCourseOfferingCommand): Promise<CourseOffering> {
    const courseExists = await this.courseChecker.exists(command.courseId);

    if (!courseExists) throw new CourseOfferingCourseNotFoundException(command.courseId);

    const academicPeriodExists = await this.academicPeriodChecker.exists(command.academicPeriodId);

    if (!academicPeriodExists)
      throw new CourseOfferingAcademicPeriodNotFoundException(command.academicPeriodId);

    const academicPeriodIsOpen = await this.academicPeriodChecker.isOpen(command.academicPeriodId);

    if (!academicPeriodIsOpen)
      throw new CourseOfferingAcademicPeriodNotOpenException(command.academicPeriodId);

    if (command.professorId) {
      const professorExists = await this.professorChecker.exists(command.professorId);

      if (!professorExists) throw new CourseOfferingProfessorNotFoundException(command.professorId);

      const professorIsActive = await this.professorChecker.isActive(command.professorId);

      if (!professorIsActive)
        throw new CourseOfferingProfessorNotActiveException(command.professorId);
    }

    const sectionAlreadyExists = await this.courseOfferingRepository.existsByCoursePeriodAndSection(
      command.courseId,
      command.academicPeriodId,
      command.section,
    );

    if (sectionAlreadyExists)
      throw new CourseOfferingSectionAlreadyExistsException(
        command.courseId,
        command.academicPeriodId,
        command.section,
      );

    const courseofferingId = this.idGenerator.generate();

    const courseOffering = CourseOffering.create({
      id: courseofferingId,
      courseId: command.courseId,
      academicPeriodId: command.academicPeriodId,
      professorId: command.professorId,
      section: command.section,
      maxCapacity: command.maxCapacity,
      availableCapacity: command.availableCapacity,
      status: null,
    });

    return await this.courseOfferingRepository.create(courseOffering);
  }
}
