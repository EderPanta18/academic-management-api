import { Inject, Injectable } from '@nestjs/common';
import {
  ACADEMIC_PROGRAM_REPOSITORY_TOKEN,
  IAcademicProgramFinder,
  IAcademicProgramRepository,
} from '../ports';

@Injectable()
export class AcademicProgramFinder implements IAcademicProgramFinder {
  constructor(
    @Inject(ACADEMIC_PROGRAM_REPOSITORY_TOKEN)
    private readonly academicProgramRepository: IAcademicProgramRepository,
  ) {}

  async findIdByCode(code: string): Promise<string | null> {
    const documentType = await this.academicProgramRepository.findByCode(code);

    return documentType ? documentType.id : null;
  }
}
