// modules/students/application/use-cases/get-student-by-id.use-case.ts

import { Inject, Injectable } from "@nestjs/common";

import { StudentNotFoundException } from "@students/domain/exceptions";
import type { StudentView } from "@students/application/read-models";
import {
  STUDENT_QUERY_PORT,
  type IStudentQuery
} from "@students/application/ports/out";

@Injectable()
export class GetStudentByIdUseCase {
  constructor(
    @Inject(STUDENT_QUERY_PORT)
    private readonly studentQuery: IStudentQuery
  ) {}

  async execute(id: number): Promise<StudentView> {
    const view = await this.studentQuery.findById(id);

    if (!view) throw new StudentNotFoundException(id);

    return view;
  }
}
