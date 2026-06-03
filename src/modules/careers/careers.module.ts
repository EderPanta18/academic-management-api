// modules/careers/careers.module.ts

import { Module } from '@nestjs/common';
import { CAREER_FINDER_PORT } from './application/ports';
import { CareerRepository } from './infrastructure/persistence';

@Module({
  providers: [
    CareerRepository,
    {
      provide: CAREER_FINDER_PORT,
      useExisting: CareerRepository,
    },
  ],
  exports: [CAREER_FINDER_PORT],
})
export class CareersModule {}
