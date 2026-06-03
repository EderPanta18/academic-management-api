// modules/enrollments/application/use-cases/get-enrollment-by-id.use-case.ts

import { Inject, Injectable } from "@nestjs/common";

import { Enrollment } from "@enrollments/domain/entities";
import {
  ENROLLMENT_REPOSITORY_PORT,
  type IEnrollmentRepository
} from "@enrollments/application/ports/out";
import { EnrollmentNotFoundException } from "@enrollments/domain/exceptions";

@Injectable()
export class GetEnrollmentByIdUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY_PORT)
    private readonly enrollmentRepository: IEnrollmentRepository
  ) {}

  async execute(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) throw new EnrollmentNotFoundException(id);

    return enrollment;
  }
}
