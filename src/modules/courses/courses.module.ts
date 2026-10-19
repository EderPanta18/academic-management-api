import { AcademicProgramsModule } from '@academic-programs';
import { Module } from '@nestjs/common';
import {
  COURSE_CATEGORY_REPOSITORY_TOKEN,
  COURSE_CHECKER_TOKEN,
  COURSE_QUERY_TOKEN,
  COURSE_REPOSITORY_TOKEN,
} from './application/ports';
import { CourseChecker } from './application/services';
import {
  CreateCourseUseCase,
  GetCourseByIdUseCase,
  ListCoursesUseCase,
} from './application/use-cases';
import { CoursesController } from './entrypoints/http';
import {
  CourseCategoryRepository,
  CourseQuery,
  CourseRepository,
} from './infrastructure/persistence';

@Module({
  imports: [AcademicProgramsModule],
  providers: [
    // Casos de uso
    CreateCourseUseCase,
    GetCourseByIdUseCase,
    ListCoursesUseCase,

    // Bindings de puertos (out)
    {
      provide: COURSE_REPOSITORY_TOKEN,
      useExisting: CourseRepository,
    },
    {
      provide: COURSE_QUERY_TOKEN,
      useExisting: CourseQuery,
    },
    {
      provide: COURSE_CATEGORY_REPOSITORY_TOKEN,
      useExisting: CourseCategoryRepository,
    },

    // Bindings de puertos (in)
    {
      provide: COURSE_CHECKER_TOKEN,
      useClass: CourseChecker,
    },
  ],
  controllers: [CoursesController],
  exports: [COURSE_CHECKER_TOKEN],
})
export class CoursesModule {}
