import { Inject, Injectable } from '@nestjs/common';
import { EnrollmentNotFoundException } from '../exceptions';
import { ENROLLMENT_QUERY_TOKEN, type IEnrollmentQuery } from '../ports/out';
import type { EnrollmentReadModel } from '../read-models';

@Injectable()
export class GetEnrollmentByIdUseCase {
  constructor(
    @Inject(ENROLLMENT_QUERY_TOKEN)
    private readonly enrollmentQuery: IEnrollmentQuery,
  ) {}

  async execute(id: string): Promise<EnrollmentReadModel> {
    const enrollment = await this.enrollmentQuery.find(id);

    if (!enrollment) throw new EnrollmentNotFoundException(id);

    return enrollment;
  }
}
