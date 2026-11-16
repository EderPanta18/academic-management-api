// src/modules/persons/entrypoints/http/mappers/person-response.mapper.ts

import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import type { PersonReadModel } from '@persons/application/read-models';
import type { Person } from '@persons/domain/entities';
import { PersonReadModelResponseDto, PersonResponseDto } from '../dtos';

export class PersonResponseMapper {
  static toResponse(person: Person): PersonResponseDto {
    const dto = new PersonResponseDto();

    dto.id = person.id;
    dto.documentTypeId = person.documentTypeId;
    dto.documentNumber = person.documentNumber;
    dto.firstName = person.firstName;
    dto.lastName = person.lastName;
    dto.email = person.email;
    dto.phone = person.phone;
    dto.birthDate = person.birthDate?.toISOString().slice(0, 10) ?? null;

    return dto;
  }

  static toReadModelResponse(readModel: PersonReadModel): PersonReadModelResponseDto {
    const dto = new PersonReadModelResponseDto();

    dto.id = readModel.id;
    dto.documentTypeId = readModel.documentTypeId;
    dto.documentTypeCode = readModel.documentTypeCode;
    dto.documentTypeName = readModel.documentTypeName;
    dto.documentNumber = readModel.documentNumber;
    dto.firstName = readModel.firstName;
    dto.lastName = readModel.lastName;
    dto.email = readModel.email;
    dto.phone = readModel.phone;
    dto.birthDate = readModel.birthDate?.toISOString().slice(0, 10) ?? null;

    return dto;
  }

  static toPaginatedResponse(
    items: PersonReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<PersonReadModelResponseDto> {
    const mappedItems = items.map(PersonResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }
}
