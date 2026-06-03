// modules/course-offerings/application/use-cases/create-course-offering.use-case.ts

import {
  ACADEMIC_PERIOD_FINDER_PORT,
  type IAcademicPeriodFinder,
} from '@academic-periods/application/ports/in';
import { EntityNotFoundException } from '@core/exceptions';
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository,
} from '@course-offerings/application/ports/out';
import { CourseOffering } from '@course-offerings/domain/entities';
import { CourseOfferingDuplicateException } from '@course-offerings/domain/exceptions';
import { COURSE_FINDER_PORT, type ICourseFinder } from '@courses/application/ports/in';
import { Inject, Injectable } from '@nestjs/common';
import { type IProfessorFinder, PROFESSOR_FINDER_PORT } from '@professors/application/ports/in';
import { CreateCourseOfferingCommand } from '../commands';
import {
  AcademicPeriodNotCurrentException,
  ProfessorNotActiveForAssignmentException,
} from '../exceptions';

@Injectable()
export class CreateCourseOfferingUseCase {
  constructor(
    @Inject(COURSE_FINDER_PORT)
    private readonly courseFinder: ICourseFinder,

    @Inject(ACADEMIC_PERIOD_FINDER_PORT)
    private readonly academicPeriodFinder: IAcademicPeriodFinder,

    @Inject(PROFESSOR_FINDER_PORT)
    private readonly professorFinder: IProfessorFinder,

    @Inject(COURSE_OFFERING_REPOSITORY_PORT)
    private readonly courseOfferingrepository: ICourseOfferingRepository,
  ) {}

  async execute(command: CreateCourseOfferingCommand): Promise<CourseOffering> {
    const courseExists = await this.courseFinder.exists(command.courseId);

    if (!courseExists) throw new EntityNotFoundException('Course', command.courseId);

    const isCurrent = await this.academicPeriodFinder.isCurrent(command.academicPeriodId);

    if (!isCurrent) throw new AcademicPeriodNotCurrentException(command.academicPeriodId);

    const section = command.section ?? 'A';

    const isDuplicate = await this.courseOfferingrepository.existsByCourseAndPeriodAndSection(
      command.courseId,
      command.academicPeriodId,
      section,
    );

    if (isDuplicate)
      throw new CourseOfferingDuplicateException(
        command.courseId,
        command.academicPeriodId,
        section,
      );

    if (command.professorId) {
      const professorExists = await this.professorFinder.exists(command.professorId);

      if (!professorExists) throw new EntityNotFoundException('Professor', command.professorId);

      const isProfessorActive = await this.professorFinder.isActive(command.professorId);

      if (!isProfessorActive)
        throw new ProfessorNotActiveForAssignmentException(command.professorId);
    }

    const offering = CourseOffering.create({
      courseId: command.courseId,
      academicPeriodId: command.academicPeriodId,
      professorId: command.professorId,
      section: command.section,
      maxStudents: command.maxStudents,
      enrollmentDeadline: command.enrollmentDeadline,
    });

    return this.courseOfferingrepository.save(offering);
  }
}
