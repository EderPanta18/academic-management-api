// modules/course-offerings/presentation/mappers/course-offering-http.mapper.ts

import { PaginatedResultDto, PaginationVO } from '@core/pagination';
import { CourseOffering } from '@course-offerings/domain/entities';
import { CourseOfferingResponseDto } from '../dtos';

export class CourseOfferingHttpMapper {
  static toResponse(offering: CourseOffering): CourseOfferingResponseDto {
    const dto = new CourseOfferingResponseDto();

    dto.id = offering.id!;
    dto.courseId = offering.courseId;
    dto.academicPeriodId = offering.academicPeriodId;
    dto.professorId = offering.professorId;
    dto.section = offering.section;
    dto.maxStudents = offering.maxStudents;
    dto.enrollmentDeadline = offering.enrollmentDeadline;
    dto.status = offering.status;
    dto.canAssignProfessor = offering.canAssignProfessor;
    dto.isOpenForEnrollment = offering.isOpenForEnrollment;
    dto.hasProfessor = offering.hasProfessor;

    return dto;
  }

  static toPaginatedResponse(
    result: PaginatedResultDto<CourseOffering>,
    pagination: PaginationVO,
  ): PaginatedResultDto<CourseOfferingResponseDto> {
    return PaginatedResultDto.from(
      result.items.map(CourseOfferingHttpMapper.toResponse),
      result.total,
      pagination,
    );
  }
}
