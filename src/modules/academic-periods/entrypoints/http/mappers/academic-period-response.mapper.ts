import type { AcademicPeriodReadModel } from '@academic-periods/application/read-models';
import type { AcademicPeriod } from '@academic-periods/domain/entities';
import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import { AcademicPeriodReadModelResponseDto, AcademicPeriodResponseDto } from '../dtos';

export class AcademicPeriodResponseMapper {
  static toResponse(academicPeriod: AcademicPeriod): AcademicPeriodResponseDto {
    const dto = new AcademicPeriodResponseDto();

    dto.id = academicPeriod.id;
    dto.code = academicPeriod.code;
    dto.name = academicPeriod.name;
    dto.startDate = academicPeriod.startDate;
    dto.endDate = academicPeriod.endDate;
    dto.enrollmentStartDate = academicPeriod.enrollmentStartDate;
    dto.enrollmentEndDate = academicPeriod.enrollmentEndDate;
    dto.status = academicPeriod.status;

    return dto;
  }

  static toReadModelResponse(
    readModel: AcademicPeriodReadModel,
  ): AcademicPeriodReadModelResponseDto {
    const dto = new AcademicPeriodReadModelResponseDto();

    dto.id = readModel.id;
    dto.code = readModel.code;
    dto.name = readModel.name;
    dto.startDate = readModel.startDate;
    dto.endDate = readModel.endDate;
    dto.enrollmentStartDate = readModel.enrollmentStartDate;
    dto.enrollmentEndDate = readModel.enrollmentEndDate;
    dto.status = readModel.status;

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
