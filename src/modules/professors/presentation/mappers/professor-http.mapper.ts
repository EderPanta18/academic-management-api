// modules/professors/presentation/mappers/professor-http.mapper.ts

import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { Professor } from '@professors/domain/entities';
import { ProfessorResponseDto } from '../dtos';

export class ProfessorHttpMapper {
  /** Entidad de dominio → DTO de respuesta HTTP */
  static toResponse(professor: Professor): ProfessorResponseDto {
    const dto = new ProfessorResponseDto();
    dto.id = professor.id!;
    dto.dni = professor.dni;
    dto.firstName = professor.firstName;
    dto.lastName = professor.lastName;
    dto.fullName = professor.fullName;
    dto.email = professor.email;
    dto.phone = professor.phone;
    dto.birthDate = professor.birthDate;
    dto.institutionalEmail = professor.institutionalEmail;
    dto.departmentId = professor.departmentId;
    dto.code = professor.code;
    dto.specialty = professor.specialty;
    dto.hireDate = professor.hireDate;
    dto.status = professor.status;
    return dto;
  }

  static toPaginatedResponse(
    result: PaginatedResultDto<Professor>,
    pagination: PaginationVO,
  ): PaginatedResultDto<ProfessorResponseDto> {
    return PaginatedResultDto.from(
      result.items.map(ProfessorHttpMapper.toResponse),
      result.total,
      pagination,
    );
  }
}
