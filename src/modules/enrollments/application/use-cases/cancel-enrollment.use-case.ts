import { ID_GENERATOR_TOKEN, type IIdGenerator } from '@core/contracts';
import type { Enrollment } from '@enrollments/domain/entities';
import { createEnrollmentStatusLog } from '@enrollments/domain/records';
import { Inject, Injectable } from '@nestjs/common';
import type { CancelEnrollmentCommand } from '../commands';
import { EnrollmentNotFoundException } from '../exceptions';
import { ENROLLMENT_REPOSITORY_TOKEN, type IEnrollmentRepository } from '../ports/out';

@Injectable()
export class CancelEnrollmentUseCase {
  constructor(
    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(ENROLLMENT_REPOSITORY_TOKEN)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(command: CancelEnrollmentCommand): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.find(command.enrollmentId);

    if (!enrollment) throw new EnrollmentNotFoundException(command.enrollmentId);

    const previousStatus = enrollment.status;
    const enrollmentUpdated = enrollment.cancel(command.reason);

    const log = createEnrollmentStatusLog({
      id: this.idGenerator.generate(),
      enrollmentId: enrollment.id,
      previousStatus,
      newStatus: enrollmentUpdated.status,
      reason: command.reason,
      changedByUserId: command.changedByUserId,
    });

    return await this.enrollmentRepository.updateWithStatusLog(enrollmentUpdated, log);
  }
}
