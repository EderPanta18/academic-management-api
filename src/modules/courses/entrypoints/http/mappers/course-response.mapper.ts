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

  static toReadModelResponse(model: CourseReadModel): CourseReadModelResponseDto {
    const dto = new CourseReadModelResponseDto();

    dto.id = model.id;
    dto.academicProgramId = model.academicProgramId;
    dto.courseCategoryId = model.courseCategoryId;
    dto.code = model.code;
    dto.name = model.name;
    dto.description = model.description;
    dto.credits = model.credits;
    dto.hours = model.hours;

    dto.academicProgramName = model.academicProgramName;
    dto.courseCategoryName = model.courseCategoryName;

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
