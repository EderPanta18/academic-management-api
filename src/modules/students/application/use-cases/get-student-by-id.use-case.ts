// modules/students/application/use-cases/get-student-by-id.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { StudentNotFoundException } from '@students/domain/exceptions';
import { type StudentView } from '@students/domain/read-models';
import {
  STUDENT_QUERY_PORT,
  type IStudentQuery,
} from '@students/domain/ports/out';

@Injectable()
export class GetStudentByIdUseCase {
  constructor(
    @Inject(STUDENT_QUERY_PORT)
    private readonly query: IStudentQuery,
  ) {}

  async execute(id: number): Promise<StudentView> {
    const view = await this.query.findById(id);
    if (!view) throw new StudentNotFoundException(id);
    return view;
  }
}
