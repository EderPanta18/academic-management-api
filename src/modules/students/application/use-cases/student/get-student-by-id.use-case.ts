import { Inject, Injectable } from '@nestjs/common';
import { StudentNotFoundException } from '@students/application/exceptions';
import { type IStudentQuery, STUDENT_QUERY_TOKEN } from '@students/application/ports/out';
import type { StudentReadModel } from '@students/application/read-models';

@Injectable()
export class GetStudentByIdUseCase {
  constructor(
    @Inject(STUDENT_QUERY_TOKEN)
    private readonly studentQuery: IStudentQuery,
  ) {}

  async execute(id: string): Promise<StudentReadModel> {
    const student = await this.studentQuery.find(id);

    if (!student) throw new StudentNotFoundException(id);

    return student;
  }
}
