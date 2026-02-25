// modules/professors/presentation/mappers/professor-http.mapper.ts

import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { Professor } from '@professors/domain/entities';
import { ProfessorResponseDto } from '../dtos';

/**
 * Traduce entre la entidad de dominio Professor
 * y el contrato HTTP ProfessorResponseDto.
 */
export class ProfessorHttpMapper {
  /** Entidad de dominio → DTO de respuesta HTTP */
  static toResponse(professor: Professor): ProfessorResponseDto {
    const dto = new ProfessorResponseDto();
    dto.id = professor.id!;
    dto.fullName = professor.fullName;
    dto.firstName = professor.firstName;
    dto.lastName = professor.lastName;
    dto.dni = professor.dni;
    dto.email = professor.email;
    dto.phone = professor.phone;
    dto.birthDate = professor.birthDate;
    dto.departmentId = professor.departmentId;
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
