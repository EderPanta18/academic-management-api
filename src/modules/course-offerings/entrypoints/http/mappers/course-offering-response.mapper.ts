import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import type { CourseOfferingReadModel } from '@course-offerings/application/read-models';
import type { CourseOffering } from '@course-offerings/domain/entities';
import { CourseOfferingReadModelResponseDto, CourseOfferingResponseDto } from '../dtos';

export class CourseOfferingResponseMapper {
  static toResponse(courseOffering: CourseOffering): CourseOfferingResponseDto {
    const dto = new CourseOfferingResponseDto();

    dto.id = courseOffering.id;
    dto.courseId = courseOffering.courseId;
    dto.academicPeriodId = courseOffering.academicPeriodId;
    dto.professorId = courseOffering.professorId;
    dto.section = courseOffering.section;
    dto.maxCapacity = courseOffering.maxCapacity;
    dto.availableCapacity = courseOffering.availableCapacity;
    dto.status = courseOffering.status;

    return dto;
  }

  static toReadModelResponse(
    readModel: CourseOfferingReadModel,
  ): CourseOfferingReadModelResponseDto {
    const dto = new CourseOfferingReadModelResponseDto();

    dto.id = readModel.id;
    dto.courseId = readModel.courseId;
    dto.academicPeriodId = readModel.academicPeriodId;
    dto.professorId = readModel.professorId;
    dto.section = readModel.section;
    dto.maxCapacity = readModel.maxCapacity;
    dto.availableCapacity = readModel.availableCapacity;
    dto.status = readModel.status;

    dto.courseCode = readModel.courseCode;
    dto.courseName = readModel.courseName;
    dto.academicPeriodCode = readModel.academicPeriodCode;
    dto.academicPeriodName = readModel.academicPeriodName;
    dto.professorFullName = readModel.professorFullName;

    return dto;
  }

  static toPaginatedResponse(
    items: CourseOfferingReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<CourseOfferingReadModelResponseDto> {
    const mappedItems = items.map(CourseOfferingResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }
}
