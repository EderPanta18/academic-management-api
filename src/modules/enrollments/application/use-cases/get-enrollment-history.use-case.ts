import { Inject, Injectable } from '@nestjs/common';
import { EnrollmentNotFoundException } from '../exceptions';
import {
  ENROLLMENT_REPOSITORY_TOKEN,
  ENROLLMENT_STATUS_LOG_QUERY_TOKEN,
  type IEnrollmentRepository,
  type IEnrollmentStatusLogQuery,
} from '../ports';
import type { EnrollmentStatusLogReadModel } from '../read-models';

@Injectable()
export class GetEnrollmentHistoryUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY_TOKEN)
    private readonly enrollmentRepository: IEnrollmentRepository,

    @Inject(ENROLLMENT_STATUS_LOG_QUERY_TOKEN)
    private readonly enrollmentStatusLogQuery: IEnrollmentStatusLogQuery,
  ) {}

  async execute(enrollmentId: string): Promise<EnrollmentStatusLogReadModel[]> {
    const enrollmentExists = await this.enrollmentRepository.exists(enrollmentId);

    if (!enrollmentExists) throw new EnrollmentNotFoundException(enrollmentId);

    return await this.enrollmentStatusLogQuery.findByEnrollmentId(enrollmentId);
  }
}
