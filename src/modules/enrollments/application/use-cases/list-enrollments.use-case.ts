// modules/enrollments/application/use-cases/list-enrollments.use-case.ts

import { Inject, Injectable } from "@nestjs/common";

import { PaginationVO, PaginatedResultDto } from "@core/pagination";
import { Enrollment } from "@enrollments/domain/entities";
import {
  ENROLLMENT_REPOSITORY_PORT,
  type IEnrollmentRepository
} from "@enrollments/application/ports/out";
import { ListEnrollmentsQuery } from "../queries";

@Injectable()
export class ListEnrollmentsUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY_PORT)
    private readonly enrollmentRepository: IEnrollmentRepository
  ) {}

  async execute(
    pagination: PaginationVO,
    query: ListEnrollmentsQuery
  ): Promise<PaginatedResultDto<Enrollment>> {
    const [enrollments, total] = await this.enrollmentRepository.findAll(
      pagination,
      {
        studentId: query.studentId,
        courseOfferingId: query.courseOfferingId,
        statuses: query.statuses
      }
    );

    return PaginatedResultDto.from(enrollments, total, pagination);
  }
}
