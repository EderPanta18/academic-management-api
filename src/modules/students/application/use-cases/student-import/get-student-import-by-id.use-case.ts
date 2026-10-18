import { Inject, Injectable } from '@nestjs/common';
import { StudentImportNotFoundException } from '@students/application/exceptions';
import {
  type IStudentImportQuery,
  STUDENT_IMPORT_QUERY_TOKEN,
} from '@students/application/ports/out';
import type { StudentImportReadModel } from '@students/application/read-models';

@Injectable()
export class GetStudentImportByIdUseCase {
  constructor(
    @Inject(STUDENT_IMPORT_QUERY_TOKEN)
    private readonly studentImportQuery: IStudentImportQuery,
  ) {}

  async execute(importId: string): Promise<StudentImportReadModel> {
    const studentImport = await this.studentImportQuery.find(importId);

    if (!studentImport) throw new StudentImportNotFoundException(importId);

    return studentImport;
  }
}
