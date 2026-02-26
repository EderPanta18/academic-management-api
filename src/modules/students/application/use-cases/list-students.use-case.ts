// modules/students/application/use-cases/list-students.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { Student } from '@students/domain/entities';
import {
  STUDENT_REPOSITORY_PORT,
  type IStudentRepository,
} from '@students/domain/ports';

@Injectable()
export class ListStudentsUseCase {
  constructor(
    @Inject(STUDENT_REPOSITORY_PORT)
    private readonly repository: IStudentRepository,
  ) {}

  async execute(
    pagination: PaginationVO,
  ): Promise<PaginatedResultDto<Student>> {
    const [students, total] = await this.repository.findAll(pagination);

    return PaginatedResultDto.from(students, total, pagination);
  }
}
