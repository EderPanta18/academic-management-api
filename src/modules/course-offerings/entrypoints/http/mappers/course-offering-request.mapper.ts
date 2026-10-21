import type {
  AssignProfessorToOfferingCommand,
  CreateCourseOfferingCommand,
} from '@course-offerings/application/commands';
import type { ListCourseOfferingsQuery } from '@course-offerings/application/queries';
import type {
  AssignProfessorRequestDto,
  CreateCourseOfferingRequestDto,
  ListCourseOfferingsQueryDto,
} from '../dtos';

export class CourseOfferingRequestMapper {
  static toListQuery(dto: ListCourseOfferingsQueryDto): ListCourseOfferingsQuery {
    return {
      courseId: dto.courseId,
      academicPeriodId: dto.academicPeriodId,
      professorId: dto.professorId,
      statuses: dto.statuses,
      search: dto.search,
    };
  }

  static toCreateCommand(dto: CreateCourseOfferingRequestDto): CreateCourseOfferingCommand {
    return {
      courseId: dto.courseId,
      academicPeriodId: dto.academicPeriodId,
      professorId: dto.professorId ?? null,
      section: dto.section,
      maxCapacity: dto.maxCapacity,
      availableCapacity: dto.availableCapacity ?? null,
    };
  }

  static toAssignProfessorCommand(
    offeringId: string,
    dto: AssignProfessorRequestDto,
  ): AssignProfessorToOfferingCommand {
    return {
      offeringId,
      professorId: dto.professorId,
    };
  }
}
