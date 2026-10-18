import { Inject, Injectable } from '@nestjs/common';
import { type IStudentFinder, type IStudentRepository, STUDENT_REPOSITORY_TOKEN } from '../ports';

@Injectable()
export class StudentFinder implements IStudentFinder {
  constructor(
    @Inject(STUDENT_REPOSITORY_TOKEN)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async getAcademicProgramId(id: string): Promise<string | null> {
    const student = await this.studentRepository.find(id);

    return student?.academicProgramId ?? null;
  }
}
