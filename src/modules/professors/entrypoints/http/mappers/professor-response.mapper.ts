import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import type { ProfessorReadModel } from '@professors/application/read-models';
import type { Professor } from '@professors/domain/entities';
import { ProfessorReadModelResponseDto, ProfessorResponseDto } from '../dtos';

export class ProfessorResponseMapper {
  static toResponse(professor: Professor): ProfessorResponseDto {
    const dto = new ProfessorResponseDto();

    dto.id = professor.id;
    dto.personId = professor.personId;
    dto.code = professor.code;
    dto.institutionalEmail = professor.institutionalEmail;
    dto.department = professor.department;
    dto.specialty = professor.specialty;
    dto.status = professor.status;

    return dto;
  }

  static toReadModelResponse(readModel: ProfessorReadModel): ProfessorReadModelResponseDto {
    const dto = new ProfessorReadModelResponseDto();

    dto.id = readModel.id;
    dto.personId = readModel.personId;
    dto.code = readModel.code;
    dto.institutionalEmail = readModel.institutionalEmail;
    dto.department = readModel.department;
    dto.specialty = readModel.specialty;
    dto.status = readModel.status;

    dto.documentTypeName = readModel.documentTypeName;
    dto.documentNumber = readModel.documentNumber;
    dto.firstName = readModel.firstName;
    dto.lastName = readModel.lastName;
    dto.email = readModel.email;
    dto.phone = readModel.phone;
    dto.birthDate = readModel.birthDate;

    return dto;
  }

  static toPaginatedResponse(
    items: ProfessorReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<ProfessorReadModelResponseDto> {
    const mappedItems = items.map(ProfessorResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }
}
