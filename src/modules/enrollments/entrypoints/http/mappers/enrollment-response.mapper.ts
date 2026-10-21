import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import type {
  EnrollmentReadModel,
  EnrollmentStatusLogReadModel,
} from '@enrollments/application/read-models';
import type { Enrollment } from '@enrollments/domain/entities';
import {
  EnrollmentReadModelResponseDto,
  EnrollmentResponseDto,
  EnrollmentStatusLogReadModelResponseDto,
} from '../dtos';

export class EnrollmentResponseMapper {
  static toResponse(enrollment: Enrollment): EnrollmentResponseDto {
    const dto = new EnrollmentResponseDto();

    dto.id = enrollment.id;
    dto.studentId = enrollment.studentId;
    dto.courseOfferingId = enrollment.courseOfferingId;
    dto.registeredByUserId = enrollment.registeredByUserId;
    dto.status = enrollment.status;
    dto.enrolledAt = enrollment.enrolledAt;
    dto.statusReason = enrollment.statusReason;

    return dto;
  }

  static toReadModelResponse(readModel: EnrollmentReadModel): EnrollmentReadModelResponseDto {
    const dto = new EnrollmentReadModelResponseDto();

    dto.id = readModel.id;
    dto.studentId = readModel.studentId;
    dto.courseOfferingId = readModel.courseOfferingId;
    dto.registeredByUserId = readModel.registeredByUserId;
    dto.status = readModel.status;
    dto.enrolledAt = readModel.enrolledAt;
    dto.statusReason = readModel.statusReason;

    dto.studentCode = readModel.studentCode;
    dto.studentFirstName = readModel.studentFirstName;
    dto.studentLastName = readModel.studentLastName;

    dto.courseId = readModel.courseId;
    dto.courseCode = readModel.courseCode;
    dto.courseName = readModel.courseName;

    dto.section = readModel.section;

    dto.academicPeriodId = readModel.academicPeriodId;
    dto.academicPeriodCode = readModel.academicPeriodCode;
    dto.academicPeriodName = readModel.academicPeriodName;

    dto.registeredByUserEmail = readModel.registeredByUserEmail;

    return dto;
  }

  static toPaginatedResponse(
    items: EnrollmentReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<EnrollmentReadModelResponseDto> {
    const mappedItems = items.map(EnrollmentResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }

  static toStatusLogReadModelResponse(
    log: EnrollmentStatusLogReadModel,
  ): EnrollmentStatusLogReadModelResponseDto {
    const dto = new EnrollmentStatusLogReadModelResponseDto();

    dto.id = log.id;
    dto.enrollmentId = log.enrollmentId;
    dto.previousStatus = log.previousStatus;
    dto.newStatus = log.newStatus;
    dto.reason = log.reason;
    dto.changedByUserId = log.changedByUserId;
    dto.changedByUserEmail = log.changedByUserEmail;
    dto.createdAt = log.createdAt;

    return dto;
  }
}
