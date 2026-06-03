// modules/enrollments/presentation/mappers/enrollment-http.mapper.ts

import { PaginationVO, PaginatedResultDto } from "@core/pagination";
import { Enrollment } from "@enrollments/domain/entities";
import { EnrollmentResponseDto } from "../dtos";

export class EnrollmentHttpMapper {
  static toResponse(enrollment: Enrollment): EnrollmentResponseDto {
    const dto = new EnrollmentResponseDto();

    dto.id = enrollment.id!;
    dto.studentId = enrollment.studentId;
    dto.courseOfferingId = enrollment.courseOfferingId;
    dto.status = enrollment.status;
    dto.enrollmentDate = enrollment.enrollmentDate.toISOString().split("T")[0];
    dto.createdBy = enrollment.createdBy;

    return dto;
  }

  static toPaginatedResponse(
    result: PaginatedResultDto<Enrollment>,
    pagination: PaginationVO
  ): PaginatedResultDto<EnrollmentResponseDto> {
    return PaginatedResultDto.from(
      result.items.map(EnrollmentHttpMapper.toResponse),
      result.total,
      pagination
    );
  }
}
