// modules/course-offerings/application/use-cases/create-course-offering.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@shared/domain/exceptions';
import { CourseOffering } from '@course-offerings/domain/entities';
import {
  ACADEMIC_PERIOD_FINDER_PORT,
  type IAcademicPeriodFinder,
} from '@modules/academic-periods/domain/ports';
import {
  COURSE_FINDER_PORT,
  type ICourseFinder,
} from '@modules/courses/domain/ports';
import {
  PROFESSOR_FINDER_PORT,
  type IProfessorFinder,
} from '@modules/professors/domain/ports';
import { CourseOfferingDuplicateException } from '@course-offerings/domain/exceptions';
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository,
} from '@course-offerings/domain/ports';
import {
  AcademicPeriodNotCurrentException,
  ProfessorNotAvailableException,
} from '../exceptions';
import { CreateCourseOfferingCommand } from '../commands';

@Injectable()
export class CreateCourseOfferingUseCase {
  constructor(
    @Inject(COURSE_OFFERING_REPOSITORY_PORT)
    private readonly repository: ICourseOfferingRepository,

    @Inject(COURSE_FINDER_PORT)
    private readonly courseFinder: ICourseFinder,

    @Inject(ACADEMIC_PERIOD_FINDER_PORT)
    private readonly academicPeriodFinder: IAcademicPeriodFinder,

    @Inject(PROFESSOR_FINDER_PORT)
    private readonly professorFinder: IProfessorFinder,
  ) {}

  async execute(command: CreateCourseOfferingCommand): Promise<CourseOffering> {
    // El curso debe existir
    const courseExists = await this.courseFinder.exists(command.courseId);

    if (!courseExists) {
      throw new EntityNotFoundException('Course', command.courseId);
    }

    // El período académico debe ser el vigente
    const isCurrent = await this.academicPeriodFinder.isCurrent(
      command.academicPeriodId,
    );

    if (!isCurrent) {
      throw new AcademicPeriodNotCurrentException(command.academicPeriodId);
    }

    // No puede existir ya una oferta con la misma combinación
    const section = command.section ?? 'A';
    const isDuplicate = await this.repository.existsByCourseAndPeriodAndSection(
      command.courseId,
      command.academicPeriodId,
      section,
    );

    if (isDuplicate) {
      throw new CourseOfferingDuplicateException(
        command.courseId,
        command.academicPeriodId,
        section,
      );
    }

    // Si se envía professorId al crear, validar que exista y esté activo
    if (command.professorId) {
      const professorExists = await this.professorFinder.exists(
        command.professorId,
      );
      if (!professorExists) {
        throw new EntityNotFoundException('Professor', command.professorId);
      }

      const isActive = await this.professorFinder.isActive(command.professorId);
      if (!isActive) {
        throw new ProfessorNotAvailableException(command.professorId);
      }
    }

    const offering = CourseOffering.create({
      courseId: command.courseId,
      academicPeriodId: command.academicPeriodId,
      professorId: command.professorId,
      section: command.section,
      maxStudents: command.maxStudents,
      enrollmentDeadline: command.enrollmentDeadline,
    });

    return this.repository.save(offering);
  }
}
