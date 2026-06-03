// modules/course-categories/course-categories.module.ts

import { Module } from '@nestjs/common';
import { COURSE_CATEGORY_FINDER_PORT } from './application/ports';
import { CourseCategoryRepository } from './infrastructure/persistence';

@Module({
  providers: [
    CourseCategoryRepository,
    {
      provide: COURSE_CATEGORY_FINDER_PORT,
      useExisting: CourseCategoryRepository,
    },
  ],
  exports: [COURSE_CATEGORY_FINDER_PORT],
})
export class CourseCategoriesModule {}
