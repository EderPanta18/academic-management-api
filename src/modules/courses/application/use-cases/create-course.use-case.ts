// modules/courses/application/use-cases/create-course.use-case.ts

import { CAREER_FINDER_PORT, type ICareerFinder } from '@careers/application/ports/in';

import { EntityNotFoundException } from '@core/exceptions';
import {
  COURSE_CATEGORY_FINDER_PORT,
  type ICourseCategoryFinder,
} from '@course-categories/application/ports/in';
import { COURSE_REPOSITORY_PORT, type ICourseRepository } from '@courses/application/ports/out';
import { Course } from '@courses/domain/entities';
import { CourseDuplicateNameException } from '@courses/domain/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import type { CreateCourseCommand } from '../commands';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(CAREER_FINDER_PORT)
    private readonly careerFinder: ICareerFinder,

    @Inject(COURSE_CATEGORY_FINDER_PORT)
    private readonly categoryFinder: ICourseCategoryFinder,

    @Inject(COURSE_REPOSITORY_PORT)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(command: CreateCourseCommand): Promise<Course> {
    const careerExists = await this.careerFinder.exists(command.careerId);

    if (!careerExists) throw new EntityNotFoundException('Career', command.careerId);

    if (command.categoryId !== undefined) {
      const categoryExists = await this.categoryFinder.exists(command.categoryId);

      if (!categoryExists) throw new EntityNotFoundException('CourseCategory', command.categoryId);
    }

    const isDuplicate = await this.courseRepository.existsByCareerAndName(
      command.careerId,
      command.name,
    );

    if (isDuplicate) throw new CourseDuplicateNameException(command.name, command.careerId);

    const course = Course.create({
      careerId: command.careerId,
      name: command.name,
      credits: command.credits,
      categoryId: command.categoryId,
      description: command.description,
    });

    return this.courseRepository.save(course);
  }
}
