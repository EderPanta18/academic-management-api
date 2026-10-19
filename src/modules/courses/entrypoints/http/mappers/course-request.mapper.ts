import type { CreateCourseCommand } from '@courses/application/commands';
import type { ListCoursesQuery } from '@courses/application/queries';
import type { CreateCourseRequestDto, ListCoursesQueryDto } from '../dtos';

export class CourseRequestMapper {
  static toCreateCommand(dto: CreateCourseRequestDto): CreateCourseCommand {
    return {
      academicProgramId: dto.academicProgramId,
      courseCategoryId: dto.courseCategoryId ?? null,
      code: dto.code,
      name: dto.name,
      description: dto.description ?? null,
      credits: dto.credits,
      hours: dto.hours ?? null,
    };
  }

  static toListQuery(dto: ListCoursesQueryDto): ListCoursesQuery {
    return {
      academicProgramId: dto.academicProgramId,
      courseCategoryId: dto.courseCategoryId,
      search: dto.search,
    };
  }
}
