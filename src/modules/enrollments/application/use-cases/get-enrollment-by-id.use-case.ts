// modules/enrollments/application/use-cases/get-enrollment-by-id.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { Enrollment } from '@enrollments/domain/entities';
import { EnrollmentNotFoundException } from '@enrollments/domain/exceptions';
import {
  ENROLLMENT_REPOSITORY_PORT,
  type IEnrollmentRepository,
} from '@enrollments/domain/ports';

@Injectable()
export class GetEnrollmentByIdUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY_PORT)
    private readonly repository: IEnrollmentRepository,
  ) {}

  async execute(id: number): Promise<Enrollment> {
    const enrollment = await this.repository.findById(id);
    if (!enrollment) throw new EnrollmentNotFoundException(id);
    return enrollment;
  }
}
