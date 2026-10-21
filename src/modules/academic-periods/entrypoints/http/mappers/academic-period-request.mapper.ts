import type { CreateAcademicPeriodCommand } from '@academic-periods/application/commands';
import type { ListAcademicPeriodsQuery } from '@academic-periods/application/queries';
import type { CreateAcademicPeriodRequestDto, ListAcademicPeriodsQueryDto } from '../dtos';

export class AcademicPeriodRequestMapper {
  static toListQuery(dto: ListAcademicPeriodsQueryDto): ListAcademicPeriodsQuery {
    return {
      status: dto.status,
      search: dto.search,
    };
  }

  static toCreateCommand(dto: CreateAcademicPeriodRequestDto): CreateAcademicPeriodCommand {
    return {
      code: dto.code,
      name: dto.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      enrollmentStartDate: dto.enrollmentStartDate ?? null,
      enrollmentEndDate: dto.enrollmentEndDate ?? null,
      status: dto.status ?? null,
    };
  }
}
