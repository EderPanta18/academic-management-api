import { Inject, Injectable } from '@nestjs/common';
import {
  ACADEMIC_PROGRAM_REPOSITORY_TOKEN,
  type IAcademicProgramChecker,
  type IAcademicProgramRepository,
} from '../ports';

@Injectable()
export class AcademicProgramChecker implements IAcademicProgramChecker {
  constructor(
    @Inject(ACADEMIC_PROGRAM_REPOSITORY_TOKEN)
    private readonly academicProgramRepository: IAcademicProgramRepository,
  ) {}

  async exists(id: string): Promise<boolean> {
    return await this.academicProgramRepository.exists(id);
  }
}
