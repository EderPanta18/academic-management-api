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

  static toReadModelResponse(model: ProfessorReadModel): ProfessorReadModelResponseDto {
    const dto = new ProfessorReadModelResponseDto();

    dto.id = model.id;
    dto.personId = model.personId;
    dto.code = model.code;
    dto.institutionalEmail = model.institutionalEmail;
    dto.department = model.department;
    dto.specialty = model.specialty;
    dto.status = model.status;

    dto.documentTypeName = model.documentTypeName;
    dto.documentNumber = model.documentNumber;
    dto.firstName = model.firstName;
    dto.lastName = model.lastName;
    dto.email = model.email;
    dto.phone = model.phone;
    dto.birthDate = model.birthDate;

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
