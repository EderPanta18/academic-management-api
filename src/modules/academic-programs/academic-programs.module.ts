import { Module } from '@nestjs/common';
import {
  ACADEMIC_PROGRAM_CHECKER_TOKEN,
  ACADEMIC_PROGRAM_FINDER_TOKEN,
  ACADEMIC_PROGRAM_REPOSITORY_TOKEN,
} from './application/ports';
import { AcademicProgramChecker, AcademicProgramFinder } from './application/services';
import { AcademicProgramRepository } from './infrastructure/persistence';

@Module({
  providers: [
    {
      provide: ACADEMIC_PROGRAM_REPOSITORY_TOKEN,
      useClass: AcademicProgramRepository,
    },
    {
      provide: ACADEMIC_PROGRAM_CHECKER_TOKEN,
      useClass: AcademicProgramChecker,
    },
    {
      provide: ACADEMIC_PROGRAM_FINDER_TOKEN,
      useClass: AcademicProgramFinder,
    },
  ],
  exports: [ACADEMIC_PROGRAM_CHECKER_TOKEN, ACADEMIC_PROGRAM_FINDER_TOKEN],
})
export class AcademicProgramsModule {}
