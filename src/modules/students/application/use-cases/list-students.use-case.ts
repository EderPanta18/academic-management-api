// modules/students/application/use-cases/list-students.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { Student } from '@students/domain/entities';
import {
  STUDENT_REPOSITORY_PORT,
  type IStudentRepository,
} from '@students/domain/ports';
import { ListStudentsQuery } from '../queries';

@Injectable()
export class ListStudentsUseCase {
  constructor(
    @Inject(STUDENT_REPOSITORY_PORT)
    private readonly repository: IStudentRepository,
  ) {}

  async execute(
    pagination: PaginationVO,
    query?: ListStudentsQuery,
  ): Promise<PaginatedResultDto<Student>> {
    const [students, total] = await this.repository.findAll(pagination, {
      careerId: query?.careerId,
    });
    return PaginatedResultDto.from(students, total, pagination);
  }
}
