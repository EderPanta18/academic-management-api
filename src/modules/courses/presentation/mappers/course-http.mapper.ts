// modules/courses/presentation/mappers/course-http.mapper.ts

import { PaginationVO, PaginatedResultDto } from "@core/pagination";
import { Course } from "@courses/domain/entities";
import { CourseResponseDto } from "../dtos";

export class CourseHttpMapper {
  static toResponse(course: Course): CourseResponseDto {
    const dto = new CourseResponseDto();

    dto.id = course.id!;
    dto.careerId = course.careerId;
    dto.categoryId = course.categoryId;
    dto.name = course.name;
    dto.description = course.description;
    dto.credits = course.credits;

    return dto;
  }

  static toPaginatedResponse(
    result: PaginatedResultDto<Course>,
    pagination: PaginationVO
  ): PaginatedResultDto<CourseResponseDto> {
    return PaginatedResultDto.from(
      result.items.map(CourseHttpMapper.toResponse),
      result.total,
      pagination
    );
  }
}
