// modules/course-offerings/application/use-cases/create-course-offering.use-case.ts

import { Inject, Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "@core/exceptions";
import {
  ACADEMIC_PERIOD_FINDER_PORT,
  type IAcademicPeriodFinder
} from "@modules/academic-periods/application/ports/in";
import {
  COURSE_FINDER_PORT,
  type ICourseFinder
} from "@modules/courses/domain/ports/in";
import {
  PROFESSOR_FINDER_PORT,
  type IProfessorFinder
} from "@modules/professors/application/ports/in";
import { CourseOffering } from "@course-offerings/domain/entities";
import { CourseOfferingDuplicateException } from "@course-offerings/domain/exceptions";
import {
  COURSE_OFFERING_REPOSITORY_PORT,
  type ICourseOfferingRepository
} from "@course-offerings/domain/ports/out";
import {
  AcademicPeriodNotCurrentException,
  ProfessorNotActiveForAssignmentException
} from "../exceptions";
import { CreateCourseOfferingCommand } from "../commands";

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
    private readonly repository: ICourseOfferingRepository
  ) {}

  async execute(command: CreateCourseOfferingCommand): Promise<CourseOffering> {
    // El curso debe existir
    const courseExists = await this.courseFinder.exists(command.courseId);

    if (!courseExists) {
      throw new EntityNotFoundException("Course", command.courseId);
    }

    // El período académico debe ser el vigente
    const isCurrent = await this.academicPeriodFinder.isCurrent(
      command.academicPeriodId
    );

    if (!isCurrent) {
      throw new AcademicPeriodNotCurrentException(command.academicPeriodId);
    }

    // No puede existir ya una oferta con la misma combinación
    const section = command.section ?? "A";
    const isDuplicate = await this.repository.existsByCourseAndPeriodAndSection(
      command.courseId,
      command.academicPeriodId,
      section
    );

    if (isDuplicate) {
      throw new CourseOfferingDuplicateException(
        command.courseId,
        command.academicPeriodId,
        section
      );
    }

    // Si se envía professorId al crear, validar que exista y esté activo
    if (command.professorId) {
      const professorExists = await this.professorFinder.exists(
        command.professorId
      );
      if (!professorExists) {
        throw new EntityNotFoundException("Professor", command.professorId);
      }

      const isProfessorActive = await this.professorFinder.isActive(
        command.professorId
      );
      if (!isProfessorActive) {
        throw new ProfessorNotActiveForAssignmentException(command.professorId);
      }
    }

    const offering = CourseOffering.create({
      courseId: command.courseId,
      academicPeriodId: command.academicPeriodId,
      professorId: command.professorId,
      section: command.section,
      maxStudents: command.maxStudents,
      enrollmentDeadline: command.enrollmentDeadline
    });

    return this.repository.save(offering);
  }
}
