import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import type { CourseReadModel } from '@courses/application/read-models';
import type { Course } from '@courses/domain/entities';
import { CourseReadModelResponseDto, CourseResponseDto } from '../dtos';

export class CourseResponseMapper {
  static toResponse(course: Course): CourseResponseDto {
    const dto = new CourseResponseDto();

    dto.id = course.id;
    dto.academicProgramId = course.academicProgramId;
    dto.courseCategoryId = course.courseCategoryId;
    dto.code = course.code;
    dto.name = course.name;
    dto.description = course.description;
    dto.credits = course.credits;
    dto.hours = course.hours;

    return dto;
  }

  static toReadModelResponse(readModel: CourseReadModel): CourseReadModelResponseDto {
    const dto = new CourseReadModelResponseDto();

    dto.id = readModel.id;
    dto.academicProgramId = readModel.academicProgramId;
    dto.courseCategoryId = readModel.courseCategoryId;
    dto.code = readModel.code;
    dto.name = readModel.name;
    dto.description = readModel.description;
    dto.credits = readModel.credits;
    dto.hours = readModel.hours;

    dto.academicProgramName = readModel.academicProgramName;
    dto.courseCategoryName = readModel.courseCategoryName;

    return dto;
  }

  static toPaginatedResponse(
    items: CourseReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<CourseReadModelResponseDto> {
    const mappedItems = items.map(CourseResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }
}
