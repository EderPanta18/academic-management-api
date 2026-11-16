// src/modules/persons/entrypoints/http/mappers/person-request.mapper.ts

import type { CreatePersonCommand, UpdatePersonCommand } from '@persons/application/commands';
import type { ListPersonsQuery } from '@persons/application/queries';
import type { CreatePersonRequestDto, ListPersonsQueryDto, UpdatePersonRequestDto } from '../dtos';

export class PersonRequestMapper {
  static toListQuery(dto: ListPersonsQueryDto): ListPersonsQuery {
    return {
      documentTypeId: dto.documentTypeId,
      search: dto.search,
    };
  }

  static toCreateCommand(dto: CreatePersonRequestDto): CreatePersonCommand {
    return {
      documentTypeId: dto.documentTypeId,
      documentNumber: dto.documentNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      birthDate: dto.birthDate ? new Date(`${dto.birthDate}T00:00:00.000Z`) : null,
    };
  }

  static toUpdateCommand(dto: UpdatePersonRequestDto): UpdatePersonCommand {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      birthDate:
        dto.birthDate === undefined
          ? undefined
          : dto.birthDate === null
            ? null
            : new Date(`${dto.birthDate}T00:00:00.000Z`),
    };
  }
}
