// modules/students/application/use-cases/get-student-by-id.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { Student } from '@students/domain/entities';
import { StudentNotFoundException } from '@students/domain/exceptions';
import {
  STUDENT_REPOSITORY_PORT,
  type IStudentRepository,
} from '@students/domain/ports';

@Injectable()
export class GetStudentByIdUseCase {
  constructor(
    @Inject(STUDENT_REPOSITORY_PORT)
    private readonly repository: IStudentRepository,
  ) {}

  async execute(id: number): Promise<Student> {
    const student = await this.repository.findById(id);

    if (!student) {
      throw new StudentNotFoundException(id);
    }

    return student;
  }
}
