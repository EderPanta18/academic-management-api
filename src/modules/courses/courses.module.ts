// modules/courses/courses.module.ts

import { Module } from '@nestjs/common';
import { CareersModule } from '@modules/careers';
import { CourseCategoriesModule } from '@modules/course-categories';
import {
  COURSE_REPOSITORY_PORT,
  COURSE_FINDER_PORT,
} from '@courses/domain/ports';
import {
  CreateCourseUseCase,
  ListCoursesUseCase,
  GetCourseByIdUseCase,
} from '@courses/application/use-cases';
import { CoursePrismaRepository } from '@courses/infrastructure/persistence';
import { CoursesController } from '@courses/presentation/controllers';

@Module({
  controllers: [CoursesController],
  imports: [CareersModule, CourseCategoriesModule],
  providers: [
    CoursePrismaRepository,
    CreateCourseUseCase,
    ListCoursesUseCase,
    GetCourseByIdUseCase,
    {
      provide: COURSE_REPOSITORY_PORT,
      useExisting: CoursePrismaRepository,
    },
    {
      provide: COURSE_FINDER_PORT,
      useExisting: CoursePrismaRepository,
    },
  ],
  exports: [COURSE_FINDER_PORT],
})
export class CoursesModule {}
