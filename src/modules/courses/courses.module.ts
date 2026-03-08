// modules/courses/courses.module.ts

import { Module } from '@nestjs/common';
import { CareersModule } from '@modules/careers';
import { CourseCategoriesModule } from '@modules/course-categories';
import { COURSE_REPOSITORY_PORT, COURSE_FINDER_PORT } from './domain/ports';
import {
  CreateCourseUseCase,
  ListCoursesUseCase,
  GetCourseByIdUseCase,
} from './application/use-cases';
import { CourseRepository } from './infrastructure/persistence';
import { CoursesController } from './presentation/controllers';

@Module({
  imports: [CareersModule, CourseCategoriesModule],
  providers: [
    CreateCourseUseCase,
    ListCoursesUseCase,
    GetCourseByIdUseCase,
    CourseRepository,
    {
      provide: COURSE_REPOSITORY_PORT,
      useExisting: CourseRepository,
    },
    {
      provide: COURSE_FINDER_PORT,
      useExisting: CourseRepository,
    },
  ],
  controllers: [CoursesController],
  exports: [COURSE_FINDER_PORT],
})
export class CoursesModule {}
