// modules/courses/courses.module.ts

import { Module } from '@nestjs/common';
import { COURSE_FINDER_PORT } from '@courses/domain/ports';
import { CoursePrismaRepository } from '@courses/infrastructure/persistence';

@Module({
  providers: [
    CoursePrismaRepository,
    {
      provide: COURSE_FINDER_PORT,
      useExisting: CoursePrismaRepository,
    },
  ],
  exports: [COURSE_FINDER_PORT],
})
export class CoursesModule {}
