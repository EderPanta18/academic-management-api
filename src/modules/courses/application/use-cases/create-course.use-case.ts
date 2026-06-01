// modules/courses/application/use-cases/create-course.use-case.ts

import { Inject, Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "@core/exceptions";
import {
  CAREER_FINDER_PORT,
  type ICareerFinder
} from "@modules/careers/application/ports/in";
import {
  COURSE_CATEGORY_FINDER_PORT,
  type ICourseCategoryFinder
} from "@modules/course-categories/application/ports/in";
import { Course } from "@courses/domain/entities";
import { CourseDuplicateNameException } from "@courses/domain/exceptions";
import {
  COURSE_REPOSITORY_PORT,
  type ICourseRepository
} from "@courses/domain/ports/out";
import { CreateCourseCommand } from "../commands";

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(CAREER_FINDER_PORT)
    private readonly careerFinder: ICareerFinder,

    @Inject(COURSE_CATEGORY_FINDER_PORT)
    private readonly categoryFinder: ICourseCategoryFinder,

    @Inject(COURSE_REPOSITORY_PORT)
    private readonly repository: ICourseRepository
  ) {}

  async execute(command: CreateCourseCommand): Promise<Course> {
    const careerExists = await this.careerFinder.exists(command.careerId);
    if (!careerExists) {
      throw new EntityNotFoundException("Career", command.careerId);
    }

    if (command.categoryId !== undefined) {
      const categoryExists = await this.categoryFinder.exists(
        command.categoryId
      );
      if (!categoryExists) {
        throw new EntityNotFoundException("CourseCategory", command.categoryId);
      }
    }

    const isDuplicate = await this.repository.existsByCareerAndName(
      command.careerId,
      command.name
    );
    if (isDuplicate) {
      throw new CourseDuplicateNameException(command.name, command.careerId);
    }

    const course = Course.create({
      careerId: command.careerId,
      name: command.name,
      credits: command.credits,
      categoryId: command.categoryId,
      description: command.description
    });

    return this.repository.save(course);
  }
}
