import type { CreateProfessorCommand } from '@professors/application/commands';
import type { ListProfessorsQuery } from '@professors/application/queries';
import type { CreateProfessorRequestDto, ListProfessorsQueryDto } from '../dtos';

export class ProfessorRequestMapper {
  static toCreateCommand(dto: CreateProfessorRequestDto): CreateProfessorCommand {
    return {
      documentTypeId: dto.documentTypeId,
      documentNumber: dto.documentNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      birthDate: dto.birthDate ?? null,
      code: dto.code,
      institutionalEmail: dto.institutionalEmail ?? null,
      department: dto.department ?? null,
      specialty: dto.specialty ?? null,
      status: dto.status ?? null,
    };
  }

  static toListQuery(dto: ListProfessorsQueryDto): ListProfessorsQuery {
    return {
      department: dto.department,
      status: dto.status,
      search: dto.search,
    };
  }
}
