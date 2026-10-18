import { Inject, Injectable } from '@nestjs/common';
import { type IStudentChecker, type IStudentRepository, STUDENT_REPOSITORY_TOKEN } from '../ports';

@Injectable()
export class StudentChecker implements IStudentChecker {
  constructor(
    @Inject(STUDENT_REPOSITORY_TOKEN)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async exists(id: string): Promise<boolean> {
    return await this.studentRepository.exists(id);
  }

  async isActive(id: string): Promise<boolean> {
    const student = await this.studentRepository.find(id);

    return student?.isActive() ?? false;
  }
}
