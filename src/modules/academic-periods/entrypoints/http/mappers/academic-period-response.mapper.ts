import type { AcademicPeriodReadModel } from '@academic-periods/application/read-models';
import type { AcademicPeriod } from '@academic-periods/domain/entities';
import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import { AcademicPeriodReadModelResponseDto, AcademicPeriodResponseDto } from '../dtos';

export class AcademicPeriodResponseMapper {
  static toResponse(period: AcademicPeriod): AcademicPeriodResponseDto {
    const dto = new AcademicPeriodResponseDto();

    dto.id = period.id;
    dto.code = period.code;
    dto.name = period.name;
    dto.startDate = period.startDate;
    dto.endDate = period.endDate;
    dto.enrollmentStartDate = period.enrollmentStartDate;
    dto.enrollmentEndDate = period.enrollmentEndDate;
    dto.status = period.status;

    return dto;
  }

  static toReadModelResponse(model: AcademicPeriodReadModel): AcademicPeriodReadModelResponseDto {
    const dto = new AcademicPeriodReadModelResponseDto();

    dto.id = model.id;
    dto.code = model.code;
    dto.name = model.name;
    dto.startDate = model.startDate;
    dto.endDate = model.endDate;
    dto.enrollmentStartDate = model.enrollmentStartDate;
    dto.enrollmentEndDate = model.enrollmentEndDate;
    dto.status = model.status;

    return dto;
  }

  static toPaginatedResponse(
    items: AcademicPeriodReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<AcademicPeriodReadModelResponseDto> {
    const mappedItems = items.map(AcademicPeriodResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }
}
