import {
  ACADEMIC_PROGRAM_CHECKER_TOKEN,
  ACADEMIC_PROGRAM_FINDER_TOKEN,
  ACADEMIC_PROGRAM_REPOSITORY_TOKEN,
} from '@academic-programs/application/ports';
import {
  AcademicProgramChecker,
  AcademicProgramFinder,
} from '@academic-programs/application/services';
import { AcademicProgramRepository } from '@academic-programs/infrastructure/persistence';
import { Module } from '@nestjs/common';

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
