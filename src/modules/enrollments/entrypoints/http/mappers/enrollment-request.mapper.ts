import type {
  CancelEnrollmentCommand,
  ConfirmEnrollmentCommand,
  EnrollStudentCommand,
  FinishEnrollmentCommand,
  RejectEnrollmentCommand,
  WithdrawEnrollmentCommand,
} from '@enrollments/application/commands';
import type { ListEnrollmentsQuery } from '@enrollments/application/queries';
import type {
  EnrollmentTransitionRequestDto,
  EnrollStudentRequestDto,
  ListEnrollmentsQueryDto,
} from '../dtos';

export class EnrollmentRequestMapper {
  static toListQuery(dto: ListEnrollmentsQueryDto): ListEnrollmentsQuery {
    return {
      studentId: dto.studentId,
      courseOfferingId: dto.courseOfferingId,
      academicPeriodId: dto.academicPeriodId,
      statuses: dto.statuses,
      search: dto.search,
    };
  }

  static toEnrollStudentCommand(
    dto: EnrollStudentRequestDto,
    registeredByUserId: string,
  ): EnrollStudentCommand {
    return {
      studentId: dto.studentId,
      courseOfferingId: dto.courseOfferingId,
      registeredByUserId,
      enrolledAt: dto.enrolledAt,
      status: dto.status ?? null,
      statusReason: dto.statusReason ?? null,
    };
  }

  static toConfirmCommand(enrollmentId: string, changedByUserId: string): ConfirmEnrollmentCommand {
    return {
      enrollmentId,
      changedByUserId,
    };
  }

  static toCancelCommand(
    enrollmentId: string,
    dto: EnrollmentTransitionRequestDto,
    changedByUserId: string,
  ): CancelEnrollmentCommand {
    return {
      enrollmentId,
      changedByUserId,
      reason: dto.reason ?? null,
    };
  }

  static toWithdrawCommand(
    enrollmentId: string,
    dto: EnrollmentTransitionRequestDto,
    changedByUserId: string,
  ): WithdrawEnrollmentCommand {
    return {
      enrollmentId,
      changedByUserId,
      reason: dto.reason ?? null,
    };
  }

  static toRejectCommand(
    enrollmentId: string,
    dto: EnrollmentTransitionRequestDto,
    changedByUserId: string,
  ): RejectEnrollmentCommand {
    return {
      enrollmentId,
      changedByUserId,
      reason: dto.reason ?? null,
    };
  }

  static toFinishCommand(
    enrollmentId: string,
    dto: EnrollmentTransitionRequestDto,
    changedByUserId: string,
  ): FinishEnrollmentCommand {
    return {
      enrollmentId,
      changedByUserId,
      reason: dto.reason ?? null,
    };
  }
}
