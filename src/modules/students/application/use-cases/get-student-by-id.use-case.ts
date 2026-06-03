// modules/students/application/use-cases/get-student-by-id.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { type IStudentQuery, STUDENT_QUERY_PORT } from '@students/application/ports/out';
import type { StudentView } from '@students/application/read-models';
import { StudentNotFoundException } from '@students/domain/exceptions';

@Injectable()
export class GetStudentByIdUseCase {
  constructor(
    @Inject(STUDENT_QUERY_PORT)
    private readonly studentQuery: IStudentQuery,
  ) {}

  async execute(id: number): Promise<StudentView> {
    const view = await this.studentQuery.findById(id);

    if (!view) throw new StudentNotFoundException(id);

    return view;
  }
}
