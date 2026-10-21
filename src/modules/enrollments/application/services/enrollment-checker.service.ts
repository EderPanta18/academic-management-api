import { Inject, Injectable } from '@nestjs/common';
import {
  ENROLLMENT_REPOSITORY_TOKEN,
  type IEnrollmentChecker,
  type IEnrollmentRepository,
} from '../ports';

@Injectable()
export class EnrollmentChecker implements IEnrollmentChecker {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY_TOKEN)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async exists(id: string): Promise<boolean> {
    return await this.enrollmentRepository.exists(id);
  }

  async isEnrolled(id: string): Promise<boolean> {
    const enrollment = await this.enrollmentRepository.find(id);

    return enrollment?.isEnrolled() ?? false;
  }
}
