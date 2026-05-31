// modules/professors/presentation/mappers/professor-http.mapper.ts

import { PaginationVO, PaginatedResultDto } from '@core/pagination';
import { Professor } from '@professors/domain/entities';
import { type ProfessorView } from '@professors/domain/read-models';
import { CreateProfessorCommand } from '@professors/application/commands';
import { ProfessorResponseDto } from '../dtos';

export class ProfessorHttpMapper {
  static toResponseFromCreate(
    professor: Professor,
    command: CreateProfessorCommand,
  ): ProfessorResponseDto {
    const dto = new ProfessorResponseDto();
    dto.id = professor.id!;
    dto.departmentId = professor.departmentId;
    dto.code = professor.code;
    dto.specialty = professor.specialty;
    dto.institutionalEmail = professor.institutionalEmail;
    dto.hireDate = professor.hireDate;
    dto.status = professor.status;
    dto.dni = command.dni;
    dto.firstName = command.firstName;
    dto.lastName = command.lastName;
    dto.fullName = `${command.firstName} ${command.lastName}`.trim();
    dto.email = command.email;
    dto.phone = command.phone ?? null;
    dto.birthDate = command.birthDate ?? null;
    return dto;
  }

  static toResponse(view: ProfessorView): ProfessorResponseDto {
    const dto = new ProfessorResponseDto();
    dto.id = view.id;
    dto.departmentId = view.departmentId;
    dto.code = view.code;
    dto.specialty = view.specialty;
    dto.institutionalEmail = view.institutionalEmail;
    dto.hireDate = view.hireDate;
    dto.status = view.status;
    dto.dni = view.dni;
    dto.firstName = view.firstName;
    dto.lastName = view.lastName;
    dto.fullName = view.fullName;
    dto.email = view.email;
    dto.phone = view.phone;
    dto.birthDate = view.birthDate;
    return dto;
  }

  static toPaginatedResponse(
    result: PaginatedResultDto<ProfessorView>,
    pagination: PaginationVO,
  ): PaginatedResultDto<ProfessorResponseDto> {
    return PaginatedResultDto.from(
      result.items.map(ProfessorHttpMapper.toResponse),
      result.total,
      pagination,
    );
  }
}
