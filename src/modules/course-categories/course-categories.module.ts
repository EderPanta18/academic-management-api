// modules/course-categories/course-categories.module.ts

import { Module } from '@nestjs/common';
import { COURSE_CATEGORY_FINDER_PORT } from '@course-categories/domain/ports';
import { CourseCategoryPrismaRepository } from '@course-categories/infrastructure/persistence';

@Module({
  providers: [
    CourseCategoryPrismaRepository,
    {
      provide: COURSE_CATEGORY_FINDER_PORT,
      useExisting: CourseCategoryPrismaRepository,
    },
  ],
  exports: [COURSE_CATEGORY_FINDER_PORT],
})
export class CourseCategoriesModule {}
