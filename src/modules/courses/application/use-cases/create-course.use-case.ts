import { ACADEMIC_PROGRAM_CHECKER_TOKEN, type IAcademicProgramChecker } from '@academic-programs';
import { ID_GENERATOR_TOKEN, type IIdGenerator } from '@core/contracts';
import { Course } from '@courses/domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import type { CreateCourseCommand } from '../commands';
import {
  CourseAcademicProgramNotFoundException,
  CourseCategoryNotFoundException,
  CourseCodeAlreadyExistsException,
} from '../exceptions';
import {
  COURSE_CATEGORY_REPOSITORY_TOKEN,
  COURSE_REPOSITORY_TOKEN,
  type ICourseCategoryRepository,
  type ICourseRepository,
} from '../ports/out';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(ACADEMIC_PROGRAM_CHECKER_TOKEN)
    private readonly academicProgramChecker: IAcademicProgramChecker,

    @Inject(COURSE_CATEGORY_REPOSITORY_TOKEN)
    private readonly courseCategoryRepository: ICourseCategoryRepository,

    @Inject(COURSE_REPOSITORY_TOKEN)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(command: CreateCourseCommand): Promise<Course> {
    const academicProgramExists = await this.academicProgramChecker.exists(
      command.academicProgramId,
    );

    if (!academicProgramExists)
      throw new CourseAcademicProgramNotFoundException(command.academicProgramId);

    if (command.courseCategoryId) {
      const categoryExists = await this.courseCategoryRepository.exists(command.courseCategoryId);

      if (!categoryExists) throw new CourseCategoryNotFoundException(command.courseCategoryId);
    }

    const codeAlreadyExists = await this.courseRepository.existsByProgramAndCode(
      command.academicProgramId,
      command.code,
    );

    if (codeAlreadyExists)
      throw new CourseCodeAlreadyExistsException(command.academicProgramId, command.code);

    const courseId = this.idGenerator.generate();

    const course = Course.create({
      id: courseId,
      academicProgramId: command.academicProgramId,
      courseCategoryId: command.courseCategoryId,
      code: command.code,
      name: command.name,
      description: command.description,
      credits: command.credits,
      hours: command.hours,
    });

    return await this.courseRepository.create(course);
  }
}
